const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

const getDashboardData = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            totalUsers,
            totalEvents,
            totalBookings,
            totalRevenue,
            recentBookings,
            popularEvents,
            bookingsByStatus,
            eventsByCategory,
            monthlyStats,
            recentUsers
        ] = await Promise.all([
            User.countDocuments(),
            
            Event.countDocuments({ isActive: true }),
            
            Booking.countDocuments(),
            
            Booking.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            
            Booking.find()
                .populate('user', 'name email')
                .populate('event', 'title')
                .sort({ createdAt: -1 })
                .limit(5),
            
            Event.aggregate([
                {
                    $lookup: {
                        from: 'bookings',
                        localField: '_id',
                        foreignField: 'event',
                        as: 'bookings'
                    }
                },
                {
                    $project: {
                        title: 1,
                        totalTicketsBooked: { $sum: '$bookings.ticketsBooked' },
                        bookingCount: { $size: '$bookings' }
                    }
                },
                { $sort: { totalTicketsBooked: -1 } },
                { $limit: 5 }
            ]),
            
            Booking.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            
            Event.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]),
            
            Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: thirtyDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        bookings: { $sum: 1 },
                        revenue: { $sum: '$totalPrice' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 6 }
            ]),
            
            User.find()
                .select('name email createdAt role')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        const confirmedBookings = bookingsByStatus.find(b => b._id === 'confirmed')?.count || 0;
        const cancelledBookings = bookingsByStatus.find(b => b._id === 'cancelled')?.count || 0;
        const pendingBookings = bookingsByStatus.find(b => b._id === 'pending')?.count || 0;
        
        const activeEvents = await Event.countDocuments({ isActive: true, date: { $gte: new Date() } });
        const pastEvents = await Event.countDocuments({ date: { $lt: new Date() } });
        
        const conversionRate = totalUsers > 0 ? ((totalBookings / totalUsers) * 100).toFixed(1) : 0;
        
        const avgTicketsPerBooking = await Booking.aggregate([
            { $group: { _id: null, avg: { $avg: '$ticketsBooked' } } }
        ]);

        res.render('analytics/dashboard', {
            title: 'Analytics Dashboard',
            metrics: {
                totalUsers,
                totalEvents,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                confirmedBookings,
                cancelledBookings,
                pendingBookings,
                activeEvents,
                pastEvents,
                conversionRate,
                avgTicketsPerBooking: avgTicketsPerBooking[0]?.avg.toFixed(1) || 0
            },
            recentBookings,
            popularEvents,
            eventsByCategory,
            monthlyStats,
            recentUsers,
            currentPage: 'dashboard'
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard data',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

const getApiStats = async (req, res) => {
    try {
        const { period = '30days' } = req.query;
        
        let dateFilter = {};
        const now = new Date();
        
        switch(period) {
            case '7days':
                dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
                break;
            case '30days':
                dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 30)) } };
                break;
            case '90days':
                dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 90)) } };
                break;
            case 'year':
                dateFilter = { createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
                break;
        }
        
        const dailyBookings = await Booking.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
        
        res.json({
            success: true,
            data: dailyBookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardData,
    getApiStats
};