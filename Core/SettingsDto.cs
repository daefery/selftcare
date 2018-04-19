using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace console.Core
{
    /// <summary>
    /// Creatae Settings DTO models 
    /// </summary>
    public class SettingsDto
    {
        /// <summary>
        /// WebApiBaseUrl for set url base in web config
        /// </summary>
        public string WebApiBaseUrl { get; set; }
    }
}