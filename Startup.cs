using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(console.Startup))]
namespace console
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
