import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req, res, next) => {
    let stats;

    const key = 'admin-stats'

    const cachedVal =  myCache.get(key)

    if(cachedVal) {
        stats = JSON.parse(cachedVal as string)
    } else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
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

        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders,
          ] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            lastMonthOrdersPromise,
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

        stats = { changePercent }
      
        return res.status(200).json({
            success: true,
            message: 'Stats fetched successfully',
            data: stats
        })
    }
})