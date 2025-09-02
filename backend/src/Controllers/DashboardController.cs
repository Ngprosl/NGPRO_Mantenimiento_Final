using Microsoft.AspNetCore.Mvc;
using NgproMantenimientos.Api.Services;

namespace NgproMantenimientos.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("kpis")]
    public async Task<ActionResult> GetKpis()
    {
        var kpis = await _dashboardService.GetKpisAsync();
        return Ok(kpis);
    }

    [HttpGet("charts")]
    public async Task<ActionResult> GetChartData()
    {
        var chartData = await _dashboardService.GetChartDataAsync();
        return Ok(chartData);
    }

    [HttpGet("alerts")]
    public async Task<ActionResult> GetAlerts()
    {
        var alerts = await _dashboardService.GetAlertsAsync();
        return Ok(alerts);
    }

    [HttpGet("summary")]
    public async Task<ActionResult> GetDashboardSummary()
    {
        var kpis = await _dashboardService.GetKpisAsync();
        var chartData = await _dashboardService.GetChartDataAsync();
        var alerts = await _dashboardService.GetAlertsAsync();

        return Ok(new
        {
            kpis,
            charts = chartData,
            alerts,
            timestamp = DateTime.UtcNow
        });
    }
}
