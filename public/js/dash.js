// Analytics Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    let bookingsChart, categoryChart, statusChart;
    
    // Load initial data
    loadChartData('30days');
    
    // Period selector change handler
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', function(e) {
            loadChartData(e.target.value);
        });
    }
    
    // Function to load chart data via AJAX
    async function loadChartData(period) {
        try {
            const response = await fetch(`/analytics/api/stats?period=${period}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                updateBookingsChart(result.data);
            }
        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    }
    
    // Update bookings chart
    function updateBookingsChart(data) {
        const labels = data.map(item => item._id);
        const bookingCounts = data.map(item => item.count);
        const revenues = data.map(item => item.revenue);
        
        if (bookingsChart) {
            bookingsChart.data.labels = labels;
            bookingsChart.data.datasets[0].data = bookingCounts;
            bookingsChart.data.datasets[1].data = revenues;
            bookingsChart.update();
        } else {
            createBookingsChart(labels, bookingCounts, revenues);
        }
    }
    
    // Create bookings chart
    function createBookingsChart(labels, bookingCounts, revenues) {
        const ctx = document.getElementById('bookingsChart')?.getContext('2d');
        if (!ctx) return;
        
        bookingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Number of Bookings',
                        data: bookingCounts,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenue ($)',
                        data: revenues,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                let value = context.parsed.y;
                                if (context.dataset.label.includes('Revenue')) {
                                    return `${label}: $${value.toLocaleString()}`;
                                }
                                return `${label}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Bookings'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Revenue ($)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    // Create category chart (donut)
    const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');
    if (categoryCtx && typeof eventsByCategory !== 'undefined') {
        const categoryLabels = eventsByCategory.map(cat => cat._id);
        const categoryData = eventsByCategory.map(cat => cat.count);
        
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: categoryLabels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
                datasets: [{
                    data: categoryData,
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: 'white'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} events (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create status chart
    const statusCtx = document.getElementById('statusChart')?.getContext('2d');
    if (statusCtx && typeof metrics !== 'undefined') {
        statusChart = new Chart(statusCtx, {
            type: 'bar',
            data: {
                labels: ['Confirmed', 'Pending', 'Cancelled'],
                datasets: [{
                    label: 'Number of Bookings',
                    data: [
                        metrics.confirmedBookings || 0,
                        metrics.pendingBookings || 0,
                        metrics.cancelledBookings || 0
                    ],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const total = metrics.totalBookings || 1;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${value} bookings (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Bookings'
                        }
                    }
                }
            }
        });
    }
    
    // Auto-refresh data every 5 minutes
    setInterval(() => {
        if (periodSelect) {
            loadChartData(periodSelect.value);
        }
    }, 300000); // 5 minutes
    
    // Add loading animation for charts
    function showLoading(container) {
        container.classList.add('loading');
    }
    
    function hideLoading(container) {
        container.classList.remove('loading');
    }
    
    // Format numbers with K/M/B suffixes
    function formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // Export data functionality (optional)
    window.exportDashboardData = function() {
        const data = {
            metrics: window.metrics,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
});