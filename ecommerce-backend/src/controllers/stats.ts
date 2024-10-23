import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventoriesCount } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req, res, next) => {
    let stats;

    const key = 'admin-stats'

    const cachedVal =  myCache.get(key)

    const lastMonths = 6;
    const latestTranstionNumber = 5;

    if(cachedVal) {
        stats = JSON.parse(cachedVal as string)
    } else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - lastMonths);
    
        const thisMonth = {
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: today,
        };
    
        const lastMonth = {
          start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
    
        const thisMonthProductsPromise = Product.find({
          createdAt: {
            $gte: thisMonth.start,
            $lte: thisMonth.end,
          },
        });
    
        const lastMonthProductsPromise = Product.find({
          createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
          },
        });
    
        const thisMonthUsersPromise = User.find({
          createdAt: {
            $gte: thisMonth.start,
            $lte: thisMonth.end,
          },
        });
    
        const lastMonthUsersPromise = User.find({
          createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
          },
        });
    
        const thisMonthOrdersPromise = Order.find({
          createdAt: {
            $gte: thisMonth.start,
            $lte: thisMonth.end,
          },
        });
    
        const lastMonthOrdersPromise = Order.find({
          createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
          },
        });
        const lastSixMonthsOrdersPromise = Order.find({
          createdAt: {
            $gte: sixMonthsAgo,
            $lte: lastMonth.end,
          },
        });

        const lastTransactionsOrdersPromise = Order.find({}).select(["orderItems", "status", "total", "discount"]).limit(latestTranstionNumber);

        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders,
            productCount,
            userCount,
            allOrders,
            lastSixMonthsOrders,
            categories,
            femaleUserCount,
            latestTransactions,
          ] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            lastMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthsOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: 'female'}),
            lastTransactionsOrdersPromise,
          ]);

        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => (total+(order?.total || 0)) ,0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => (total+(order?.total || 0)) ,0);

        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(
                thisMonthProducts.length,
                lastMonthProducts.length
            ),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePercentage(
                thisMonthOrders.length,
                lastMonthOrders.length
            ),
        };

        const revenue = allOrders.reduce((total, order) => (total + (order.total || 0)), 0);

        const orderMonthCount = new Array(lastMonths).fill(0);
        const orderMonthlyRevenue = new Array(lastMonths).fill(0);

        lastSixMonthsOrders.forEach((order) => {
          const orderCreation = order.createdAt;
          const monthIndex = today.getMonth() - orderCreation.getMonth();

          if(monthIndex < lastMonths) {
            orderMonthCount[lastMonths - monthIndex -1] += 1;
            orderMonthlyRevenue[lastMonths - monthIndex -1] += order.total;
          }
        })

        const categoryCountPercentages = await getInventoriesCount(categories, productCount)

        const count = {
          revenue,
          user: userCount,
          product: productCount,
          order: allOrders.length,
        }

        const chart = {
          order: orderMonthCount,
          revenue: orderMonthlyRevenue,
        }

        const gender_ratio = {
          male: userCount - femaleUserCount,
          female: femaleUserCount
        }

        const modifiedLatestTransactions = latestTransactions.map(transaction => ({
          _id: transaction._id,
          amount: transaction.total,
          discount: transaction.discount,
          quantity: transaction.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
          status: transaction.status,
        }))

        stats = { changePercent, count, chart, categoryCountPercentages, gender_ratio, latest_transactions: modifiedLatestTransactions }

        myCache.set(key, JSON.stringify(stats))

    }

    return res.status(200).json({
        success: true,
        message: 'Stats fetched successfully',
        data: stats
    })
})

export const getPieCharts = TryCatch(async(req, res, next) => {
  const marketingInvestmentPercentage = 30;

  const cachedKey = 'admin_pie-chars';

  const cachedVal = myCache.get(cachedKey);

  let chart;

  if (cachedVal) {
    chart = cachedVal
  } else {    
      const [ processing, delivered, shipped, categoriesList, totalProductsNumber, out_of_Stock, allOrders, usersDobs, number_of_admin, number_of_user  ] = await Promise.all([
        Order.countDocuments({ status: 'Processing' }),
        Order.countDocuments({ status: 'Delivered' }),
        Order.countDocuments({ status: 'Shipped' }),
        Product.distinct("category"),
        Product.countDocuments(),
        Product.countDocuments({ stock: 0 }),
        Order.find({}).select(['tax', 'shippingCharges', 'total', 'discount']),
        User.find({}).select(["dob"]),
        User.countDocuments({role: 'admin'}),
        User.countDocuments({role: 'user'}),
      ])
    
      const order_fulfillment = { processing, delivered, shipped }
      const categories_count = await getInventoriesCount(categoriesList, totalProductsNumber);
      const stock_available = {
        in_stock: totalProductsNumber - out_of_Stock,
        out_of_Stock
      }
    
      const grossIncome = allOrders.reduce((total, order) => (total + (order.total || 0)), 0);
      const discount = allOrders.reduce((sum, order) => (sum +( order.discount || 0)), 0)
      const burnt = allOrders.reduce((sum, order) => (sum +( order.tax || 0)), 0)
      const production_cost = allOrders.reduce((sum, order) => (sum +( order.shippingCharges || 0)), 0)
      const marketing_cost = Math.round(grossIncome * marketingInvestmentPercentage / 100);
      const net_margin = grossIncome - discount - burnt - production_cost - marketing_cost;
    
      const revenue_distribution = {
        production_cost, marketing_cost, discount, burnt, net_margin
      }
    
      
      const age_groups = {
        teen: usersDobs?.filter(user => user.age <= 20)?.length,
        adult: usersDobs?.filter(user => user.age > 20 && user.age <= 40)?.length,
        old: usersDobs?.filter(user => user.age > 40)?.length,
      }
    
      const role_groups = {
        number_of_admin, number_of_user
      }

      chart = { order_fulfillment, categories_count, stock_available, revenue_distribution, age_groups, role_groups }
  }

  myCache.set(cachedKey, JSON.stringify(chart))

  return res.json({
    success: true,
    message: 'Chart fetched successfully',
    data: chart,
  })
})