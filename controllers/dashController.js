const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get analytics dashboard data
// @route   GET /analytics/dashboard
// @access  Private/Admin
const getDashboardData = async (req, res) => {
    try {
        // Get date range for filtering (last 30 days by default)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Parallel queries for better performance
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
            // Total users count
            User.countDocuments(),
            
            // Total events count
            Event.countDocuments({ isActive: true }),
            
            // Total bookings count
            Booking.countDocuments(),
            
            // Total revenue from paid bookings
            Booking.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            
            // Recent bookings (last 5)
            Booking.find()
                .populate('user', 'name email')
                .populate('event', 'title')
                .sort({ createdAt: -1 })
                .limit(5),
            
            // Most popular events (top 5 by tickets booked)
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
            
            // Bookings grouped by status
            Booking.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            
            // Events grouped by category
            Event.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]),
            
            // Monthly statistics for chart (last 6 months)
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
            
            // Recent users (last 5)
            User.find()
                .select('name email createdAt role')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        // Calculate additional metrics
        const confirmedBookings = bookingsByStatus.find(b => b._id === 'confirmed')?.count || 0;
        const cancelledBookings = bookingsByStatus.find(b => b._id === 'cancelled')?.count || 0;
        const pendingBookings = bookingsByStatus.find(b => b._id === 'pending')?.count || 0;
        
        const activeEvents = await Event.countDocuments({ isActive: true, date: { $gte: new Date() } });
        const pastEvents = await Event.countDocuments({ date: { $lt: new Date() } });
        
        // Calculate booking conversion rate
        const conversionRate = totalUsers > 0 ? ((totalBookings / totalUsers) * 100).toFixed(1) : 0;
        
        // Average tickets per booking
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

// @desc    Get API data for charts (AJAX endpoint)
// @route   GET /analytics/api/stats
// @access  Private/Admin
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