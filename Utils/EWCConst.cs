using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace console.Utils
{
    /// <summary>
    /// This class is used to contain const of web client
    /// </summary>
    public class ErrorPageConst
    {
        /// <summary>
        /// Error Not Found Title
        /// </summary>
        public const String NotFoundTitle = "Sorry, the page not found!";
        /// <summary>
        /// Error Internal server Title
        /// </summary>
        public const String InternalServerErrorTitle = "Ooops, something went wrong!";
        /// <summary>
        /// Error Bad Request Title
        /// </summary>
        public const String BadRequestTitle = "We couldn't understand your request!";
        /// <summary>
        /// Error Bad Request Title
        /// </summary>
        public const String ForbiddenTitle = "Sorry, you don't have permission to access on this server!";
    }
}