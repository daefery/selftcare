'use strict';

commonModule.factory('CommonEnum', function ($filter) {
    var countryList = [
    { name: 'Afghanistan', code: 'AF', value: 4 },
    { name: 'Aland Islands', code: 'AX', value: 248 },
    { name: 'Albania', code: 'AL', value: 8 },
    { name: 'Algeria', code: 'DZ', value: 12 },
    { name: 'American Samoa', code: 'AS', value: 16 },
    { name: 'Andorra', code: 'AD', value: 20 },
    { name: 'Angola', code: 'AO', value: 24 },
    { name: 'Anguilla', code: 'AI', value: 660 },
    { name: 'Antarctica', code: 'AQ', value: 10 },
    { name: 'Antigua and Barbuda', code: 'AG', value: 28 },
    { name: 'Argentina', code: 'AR', value: 32 },
    { name: 'Armenia', code: 'AM', value: 51 },
    { name: 'Aruba', code: 'AW', value: 533 },
    { name: 'Australia', code: 'AU', value: 36 },
    { name: 'Austria', code: 'AT', value: 40 },
    { name: 'Azerbaijan', code: 'AZ', value: 31 },
    { name: 'Bahamas', code: 'BS', value: 44 },
    { name: 'Bahrain', code: 'BH', value: 48 },
    { name: 'Bangladesh', code: 'BD', value: 50 },
    { name: 'Barbados', code: 'BB', value: 52 },
    { name: 'Belarus', code: 'BY', value: 122 },
    { name: 'Belgium', code: 'BE', value: 56 },
    { name: 'Belize', code: 'BZ', value: 84 },
    { name: 'Benin', code: 'BJ', value: 204 },
    { name: 'Bermuda', code: 'BM', value: 60 },
    { name: 'Bhutan', code: 'BT', value: 64 },
    { name: 'Bolivia', code: 'BO', value: 68 },
    { name: 'Bosnia and Herzegovina', code: 'BA', value: 70 },
    { name: 'Botswana', code: 'BW', value: 72 },
    { name: 'Bouvet Island', code: 'BV', value: 74 },
    { name: 'Brazil', code: 'BR', value: 76 },
    { name: 'British Indian Ocean Territory', code: 'IO', value: 86 },
    { name: 'Brunei Darussalam', code: 'BN', value: 96 },
    { name: 'Bulgaria', code: 'BG', value: 100 },
    { name: 'Burkina Faso', code: 'BF', value: 854 },
    { name: 'Burundi', code: 'BI', value: 108 },
    { name: 'Cambodia', code: 'KH', value: 116 },
    { name: 'Cameroon', code: 'CM', value: 120 },
    { name: 'Canada', code: 'CA', value: 124 },
    { name: 'Cape Verde', code: 'CV', value: 132 },
    { name: 'Cayman Islands', code: 'KY', value: 136 },
    { name: 'Central African Republic', code: 'CF', value: 140 },
    { name: 'Chad', code: 'TD', value: 148 },
    { name: 'Chile', code: 'CL', value: 152 },
    { name: 'China', code: 'CN', value: 156 },
    { name: 'Christmas Island', code: 'CX', value: 162 },
    { name: 'Cocos (Keeling) Islands', code: 'CC', value: 166 },
    { name: 'Colombia', code: 'CO', value: 170 },
    { name: 'Comoros', code: 'KM', value: 174 },
    { name: 'Congo', code: 'CG', value: 178 },
    { name: 'Congo, The Democratic Republic of the', code: 'CD', value: 180 },
    { name: 'Cook Islands', code: 'CK', value: 184 },
    { name: 'Costa Rica', code: 'CR', value: 188 },
    { name: 'Cote D\'Ivoire', code: 'CI', value: 384 },
    { name: 'Croatia', code: 'HR', value: 191 },
    { name: 'Cuba', code: 'CU', value: 192 },
    { name: 'Cyprus', code: 'CY', value: 196 },
    { name: 'Czech Republic', code: 'CZ', value: 203 },
    { name: 'Denmark', code: 'DK', value: 208 },
    { name: 'Djibouti', code: 'DJ', value: 262 },
    { name: 'Dominica', code: 'DM', value: 212 },
    { name: 'Dominican Republic', code: 'DO', value: 214 },
    { name: 'Ecuador', code: 'EC', value: 218 },
    { name: 'Egypt', code: 'EG', value: 818 },
    { name: 'El Salvador', code: 'SV', value: 222 },
    { name: 'Equatorial Guinea', code: 'GQ', value: 226 },
    { name: 'Eritrea', code: 'ER', value: 232 },
    { name: 'Estonia', code: 'EE', value: 233 },
    { name: 'Ethiopia', code: 'ET', value: 231 },
    { name: 'Falkland Islands (Malvinas)', code: 'FK', value: 238 },
    { name: 'Faroe Islands', code: 'FO', value: 234 },
    { name: 'Fiji', code: 'FJ', value: 242 },
    { name: 'Finland', code: 'FI', value: 246 },
    { name: 'France', code: 'FR', value: 250 },
    { name: 'French Guiana', code: 'GF', value: 254 },
    { name: 'French Polynesia', code: 'PF', value: 258 },
    { name: 'French Southern Territories', code: 'TF', value: 260 },
    { name: 'Gabon', code: 'GA', value: 266 },
    { name: 'Gambia', code: 'GM', value: 270 },
    { name: 'Georgia', code: 'GE', value: 268 },
    { name: 'Germany', code: 'DE', value: 276 },
    { name: 'Ghana', code: 'GH', value: 288 },
    { name: 'Gibraltar', code: 'GI', value: 292 },
    { name: 'Greece', code: 'GR', value: 300 },
    { name: 'Greenland', code: 'GL', value: 304 },
    { name: 'Grenada', code: 'GD', value: 308 },
    { name: 'Guadeloupe', code: 'GP', value: 312 },
    { name: 'Guam', code: 'GU', value: 316 },
    { name: 'Guatemala', code: 'GT', value: 320 },
    { name: 'Guinea', code: 'GN', value: 324 },
    { name: 'Guinea-Bissau', code: 'GW', value: 624 },
    { name: 'Guyana', code: 'GY', value: 328 },
    { name: 'Haiti', code: 'HT', value: 332 },
    { name: 'Heard Island and Mcdonald Islands', code: 'HM', value: 334 },
    { name: 'Holy See (Vatican City State)', code: 'VA', value: 336 },
    { name: 'Honduras', code: 'HN', value: 340 },
    { name: 'Hong Kong', code: 'HK', value: 344 },
    { name: 'Hungary', code: 'HU', value: 348 },
    { name: 'Iceland', code: 'IS', value: 352 },
    { name: 'India', code: 'IN', value: 356 },
    { name: 'Indonesia', code: 'ID', value: 360 },
    { name: 'Iran, Islamic Republic Of', code: 'IR', value: 364 },
    { name: 'Iraq', code: 'IQ', value: 368 },
    { name: 'Ireland', code: 'IE', value: 372 },
    { name: 'Israel', code: 'IL', value: 376 },
    { name: 'Italy', code: 'IT', value: 380 },
    { name: 'Jamaica', code: 'JM', value: 388 },
    { name: 'Japan', code: 'JP', value: 392 },
    { name: 'Jordan', code: 'JO', value: 400 },
    { name: 'Kazakhstan', code: 'KZ', value: 398 },
    { name: 'Kenya', code: 'KE', value: 404 },
    { name: 'Kiribati', code: 'KI', value: 296 },
    { name: 'Korea, Democratic People\'s Republic of', code: 'KP', value: 408 },
    { name: 'Korea, Republic of', code: 'KR', value: 410 },
    { name: 'Kuwait', code: 'KW', value: 414 },
    { name: 'Kyrgyzstan', code: 'KG', value: 417 },
    { name: 'Lao People\'s Democratic Republic', code: 'LA', value: 418 },
    { name: 'Latvia', code: 'LV', value: 428 },
    { name: 'Lebanon', code: 'LB', value: 422 },
    { name: 'Lesotho', code: 'LS', value: 426 },
    { name: 'Liberia', code: 'LR', value: 430 },
    { name: 'Libyan Arab Jamahiriya', code: 'LY', value: 343 },
    { name: 'Liechtenstein', code: 'LI', value: 438 },
    { name: 'Lithuania', code: 'LT', value: 440 },
    { name: 'Luxembourg', code: 'LU', value: 442 },
    { name: 'Macao', code: 'MO', value: 446 },
    { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK', value: 807 },
    { name: 'Madagascar', code: 'MG', value: 450 },
    { name: 'Malawi', code: 'MW', value: 454 },
    { name: 'Malaysia', code: 'MY', value: 458 },
    { name: 'Maldives', code: 'MV', value: 462 },
    { name: 'Mali', code: 'ML', value: 466 },
    { name: 'Malta', code: 'MT', value: 470 },
    { name: 'Marshall Islands', code: 'MH', value: 584 },
    { name: 'Martinique', code: 'MQ', value: 474 },
    { name: 'Mauritania', code: 'MR', value: 478 },
    { name: 'Mauritius', code: 'MU', value: 480 },
    { name: 'Mayotte', code: 'YT', value: 175 },
    { name: 'Mexico', code: 'MX', value: 484 },
    { name: 'Micronesia, Federated States of', code: 'FM', value: 583 },
    { name: 'Moldova, Republic of', code: 'MD', value: 498 },
    { name: 'Monaco', code: 'MC', value: 492 },
    { name: 'Mongolia', code: 'MN', value: 496 },
    { name: 'Montserrat', code: 'MS', value: 500 },
    { name: 'Morocco', code: 'MA', value: 504 },
    { name: 'Mozambique', code: 'MZ', value: 508 },
    { name: 'Myanmar', code: 'MM', value: 104 },
    { name: 'Namibia', code: 'NA', value: 516 },
    { name: 'Nauru', code: 'NR', value: 520 },
    { name: 'Nepal', code: 'NP', value: 524 },
    { name: 'Netherlands', code: 'NL', value: 528 },
    { name: 'Netherlands Antilles', code: 'AN', value: 530 },
    { name: 'New Caledonia', code: 'NC', value: 540 },
    { name: 'New Zealand', code: 'NZ', value: 554 },
    { name: 'Nicaragua', code: 'NI', value: 558 },
    { name: 'Niger', code: 'NE', value: 562 },
    { name: 'Nigeria', code: 'NG', value: 566 },
    { name: 'Niue', code: 'NU', value: 570 },
    { name: 'Norfolk Island', code: 'NF', value: 574 },
    { name: 'Northern Mariana Islands', code: 'MP', value: 580 },
    { name: 'Norway', code: 'NO', value: 578 },
    { name: 'Oman', code: 'OM', value: 512 },
    { name: 'Pakistan', code: 'PK', value: 586 },
    { name: 'Palau', code: 'PW', value: 585 },
    { name: 'Palestinian Territory, Occupied', code: 'PS', value: 275 },
    { name: 'Panama', code: 'PA', value: 591 },
    { name: 'Papua New Guinea', code: 'PG', value: 598 },
    { name: 'Paraguay', code: 'PY', value: 600 },
    { name: 'Peru', code: 'PE', value: 604 },
    { name: 'Philippines', code: 'PH', value: 608 },
    { name: 'Pitcairn', code: 'PN', value: 612 },
    { name: 'Poland', code: 'PL', value: 616 },
    { name: 'Portugal', code: 'PT', value: 620 },
    { name: 'Puerto Rico', code: 'PR', value: 630 },
    { name: 'Qatar', code: 'QA', value: 634 },
    { name: 'Reunion', code: 'RE', value: 638 },
    { name: 'Romania', code: 'RO', value: 642 },
    { name: 'Russian Federation', code: 'RU', value: 643 },
    { name: 'Rwanda', code: 'RW', value: 646 },
    { name: 'Saint Helena', code: 'SH', value: 654 },
    { name: 'Saint Kitts and Nevis', code: 'KN', value: 659 },
    { name: 'Saint Lucia', code: 'LC', value: 662 },
    { name: 'Saint Pierre and Miquelon', code: 'PM', value: 666 },
    { name: 'Saint Vincent and the Grenadines', code: 'VC', value: 670 },
    { name: 'Samoa', code: 'WS', value: 882 },
    { name: 'San Marino', code: 'SM', value: 674 },
    { name: 'Sao Tome and Principe', code: 'ST', value: 678 },
    { name: 'Saudi Arabia', code: 'SA', value: 682 },
    { name: 'Senegal', code: 'SN', value: 686 },
    { name: 'Serbia and Montenegro', code: 'CS', value: 891 },
    { name: 'Seychelles', code: 'SC', value: 690 },
    { name: 'Sierra Leone', code: 'SL', value: 694 },
    { name: 'Singapore', code: 'SG', value: 702 },
    { name: 'Slovakia', code: 'SK', value: 703 },
    { name: 'Slovenia', code: 'SI', value: 705 },
    { name: 'Solomon Islands', code: 'SB', value: 90 },
    { name: 'Somalia', code: 'SO', value: 706 },
    { name: 'South Africa', code: 'ZA', value: 710 },
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS', value: 239 },
    { name: 'Spain', code: 'ES', value: 724 },
    { name: 'Sri Lanka', code: 'LK', value: 144 },
    { name: 'Sudan', code: 'SD', value: 736 },
    { name: 'Suriname', code: 'SR', value: 740 },
    { name: 'Svalbard and Jan Mayen', code: 'SJ', value: 744 },
    { name: 'Swaziland', code: 'SZ', value: 748 },
    { name: 'Sweden', code: 'SE', value: 752 },
    { name: 'Switzerland', code: 'CH', value: 756 },
    { name: 'Syrian Arab Republic', code: 'SY', value: 760 },
    { name: 'Taiwan, Province of China', code: 'TW', value: 158 },
    { name: 'Tajikistan', code: 'TJ', value: 762 },
    { name: 'Tanzania, United Republic of', code: 'TZ', value: 834 },
    { name: 'Thailand', code: 'TH', value: 764 },
    { name: 'Timor-Leste', code: 'TL', value: 626 },
    { name: 'Togo', code: 'TG', value: 768 },
    { name: 'Tokelau', code: 'TK', value: 772 },
    { name: 'Tonga', code: 'TO', value: 776 },
    { name: 'Trinidad and Tobago', code: 'TT', value: 780 },
    { name: 'Tunisia', code: 'TN', value: 788 },
    { name: 'Turkey', code: 'TR', value: 792 },
    { name: 'Turkmenistan', code: 'TM', value: 795 },
    { name: 'Turks and Caicos Islands', code: 'TC', value: 796 },
    { name: 'Tuvalu', code: 'TV', value: 798 },
    { name: 'Uganda', code: 'UG', value: 800 },
    { name: 'Ukraine', code: 'UA', value: 804 },
    { name: 'United Arab Emirates', code: 'AE', value: 784 },
    { name: 'United Kingdom', code: 'GB', value: 826 },
    { name: 'United States', code: 'US', value: 840 },
    { name: 'United States Minor Outlying Islands', code: 'UM', value: 581 },
    { name: 'Uruguay', code: 'UY', value: 858 },
    { name: 'Uzbekistan', code: 'UZ', value: 860 },
    { name: 'Vanuatu', code: 'VU', value: 548 },
    { name: 'Vatican City State (Holy See)', code: 'VA', value: 336 },
    { name: 'Venezuela', code: 'VE', value: 862 },
    { name: 'Vietnam', code: 'VN', value: 704 },
    { name: 'Virgin Islands, British', code: 'VG', value: 92 },
    { name: 'Virgin Islands, U.S.', code: 'VI', value: 850 },
    { name: 'Wallis and Futuna', code: 'WF', value: 876 },
    { name: 'Western Sahara', code: 'EH', value: 732 },
    { name: 'Yemen', code: 'YE', value: 887 },
    { name: 'Zambia', code: 'ZM', value: 894 },
    { name: 'Zimbabwe', code: 'ZW', value: 716 }

    ];

    var securityQuestions = [
    { name: "What was your childhood nickname?", value: "Q01" },
    { name: "In what city did you meet your spouse/significant other?", value: "Q02" },
    { name: "What is the name of your favorite childhood friend?", value: "Q03" },
    { name: "What street did you live on in third grade?", value: "Q04" },
    { name: "What is your oldest sibling’s birthday month and year?", value: "Q05" },
    { name: "What is the middle name of your oldest child?", value: "Q06" },
    { name: "What is your oldest sibling's middle name?", value: "Q07" },
    { name: "What school did you attend for sixth grade?", value: "Q08" },
    { name: "What was your childhood phone number including area code?", value: "Q09" },
    { name: "What is your oldest cousin's first and last name?", value: "Q10" },
    { name: "What was the name of your first stuffed animal?", value: "Q11" },
    { name: "In what city or town did your mother and father meet?", value: "Q12" },
    { name: "Where were you when you had your first kiss?", value: "Q13" },
    { name: "What is the first name of the boy or girl that you first kissed?", value: "Q14" },
    { name: "What was the last name of your third grade teacher?", value: "Q15" },
    { name: "In what city does your nearest sibling live?", value: "Q16" },
    { name: "What is your oldest brother’s birthday month and year?", value: "Q17" },
    { name: "What is your maternal grandmother's maiden name?", value: "Q18" },
    { name: "In what city or town was your first job?", value: "Q19" },
    { name: "What is the name of the place your wedding reception was held?", value: "Q20" },
    { name: "What is the name of a college you applied to but didn't attend?", value: "Q21" },
    ]


    var documentType = [
        { name: 'Passport', value : 1 },
        { name: 'DrivingLicence', value: 2 },
        { name: 'DNI', value: 3 },
        { name: 'NIF', value: 4 },
        { name: 'NIE', value: 5 },
        { name: 'CIF', value: 6 }
    ];

    
    // response code object
    var responseErrorCode = {
        InternalServerError: 500,
        RequestTimeOut: 408,
        BadRequest: 400,
        Forbidden: 403,
        NotFound: 404,
        ServerNotFound: 0,
        Unauthorized: 401
    };

    var responseErrorMessage = {
        InternalServerError: "This may be a temporary glitch or the server may be down.",
        RequestTimeOut: "Request TimeOut",
        BadRequest: "Bad Request",
        Forbidden: "Forbidden",
        NotFound: "Not Found.",
        ServerNotFound: "Server is not found. This may be a temporary glitch or the server may be down.",
        WrongUsernameOrPassword: "Wrong username/password. Please input the right username/password.",
        FailedLoginAttemptsExceeded: "You have exceeded the login attempts limit, Your account is locked for 15 minutes!",
        AccountClosed: "Sorry, your account is already closed.",
        AccountNotVerified: "Your account has not verified. Please verify your account first and try to login again.",
        AccountNotConfiguredWithMobilePhone: "Your account is not configured with mobile phone.",
        AccountNotConfiguredWithCertificates: "Your account is not configured with certificates authorization.",
        PasswordExpired: "Your password has expired. Click <a href='/Authorization/RecoverPassword' target='_self'>here</a> to recover your password",
        Unauthorize: "Your session is unauthorized, please try to login again.",
        LoginNotAllowed: "Your account is not allowed to login.",
        AuthInternalServerError: "Oops, something went wrong. It's not you, it's us! This may be a temporary glitch or the server may be down."
    };

    var authErrorCode = {
        WrongUsernameOrPassword: "TPEC_1",
        FailedLoginAttemptsExceeded: "TPEC_2",
        AccountClosed: "TPEC_3",
        AccountNotVerified: "TPEC_4",
        AccountNotConfiguredWithMobilePhone: "TPEC_5",
        AccountNotConfiguredWithCertificates: "TPEC_6",
        PasswordExpired: "TPEC_7",
        LoginNotAllowed: "TPEC_8"

    };

    var gender = [
    { name: 'Male', value: 0 },
    { name: 'Female', value: 1 }
    ];

    var orderStatus = [
        { name: 'Pending', value: 0 },
        { name: 'Processed', value: 1 },
        { name: 'Cancelled', value: 2 }
    ];

    var customerStatus = [
        { name:'Draft',value:0 },
        { name: 'Pending', value: 1 },
        { name: 'Active', value: 2 },
        { name: 'Terminated', value: 3 },
        { name: 'PreActive', value: 4 },
        { name: 'Regulatory', value: 6 },
        { name: 'Deleted', value: 20 }
    ];

    var TTSeverity = [
    { name: 'Immediately', value: 1 },
    { name: 'Clocked', value: 2 },
    { name: 'Suspend', value: 3 }
    ];

    var TTIncident = [
        { name: 'Individual', value: 1 },
        { name: 'General', value: 2 }
    ];

    var TTStatus = [
        { name: 'Keep_Current_State', value: -999 },
        { name: 'Created', value: 100 },
        { name: 'Associated', value: 101 },
        { name: 'Pending_OMV', value: 102 },
        { name: 'Pending_Verification', value: 103 },
        { name: 'Rejected', value: 104 },
        { name: 'Closed', value: 105 },
        { name: 'Current', value: 106 },
        { name: 'Completed', value: 107 }
    ];

    var TTScreenType = [
        { name: 'Comment', value: 0 },
        { name: 'Resolution', value: 1 },
        { name: 'Update', value: 2 },
        { name: 'SupportComment', value: 3 },
    ];

    var TTCommentType = [
        { name: 'Comment', value: 0 },
        { name: 'Resolution', value: 1 },
        { name: 'Update', value: 2 },
        { name: 'SupportComment', value: 3 },
    ]

    var multiSubscriptionType = [
        { name: 'Unknown', value: -1 },
        { name: 'Postpayment', value: 1 },
        { name: 'Prepayment', value: 2 },
        { name: 'Hybrid', value: 3 }
    ];

    var paymentType = [
        { name: 'Unknown', value: -1 },
        { name: 'Postpayment', value: 1 },
        { name: 'Prepayment', value: 2 },
        { name: 'Hybrid', value: 3 }
    ];

    var customerBusinessType = [
        { name: 'None', value: -1 },
        { name: 'Private', value: 1 },
        { name: 'Business', value: 2 }
    ];

    var simStatus = [
        { name: 'NotInAuc', value: 0 },
        { name: 'Active', value: 1 },
        { name: 'Deactive', value: 2 },
        { name: 'Expired', value: 3 },
        { name: 'Reserved', value: 4 },
        { name: 'Locked', value: 5 },
        { name: 'Init', value: 8 },
        { name: 'Installed', value: 9 },
        { name: 'Inactive', value: 10 },
        { name: 'Frozen', value: 11 },
        { name: 'R2', value: 13 }
    ];
    var phoneCategory = [
        { name: 'Gold', value: 1 },
        { name: 'Silver', value: 2 },
        { name: 'Bronze', value: 3 },
        { name: 'Standard', value: 4 }
    ];

    var usageSubTypes = [
        {name: "Voice", value: 3001},
        {name: "SMS", value: 3002},
        {name: "Data", value: 3003},
        {name: "MMS", value: 3004},
        {name: "VideoCall", value: 3005},
    ];

    var ttTagEnum = [
        { name: "True", value: 1 },
        { name: "False", value: 2 },
        { name: "External", value: 3 }
    ];

    var ttEscalationEnum = [
        { name: "Back Office", value: 1 },
        { name: "Problem Manager", value: 2 },
        { name: "Manager SD", value: 3 }
    ];

    var ttEscalationReasonEnum = [
        { name: "Recurring Problem", value: 1 },
        { name: "Stuck Solution", value: 2 },
        { name: "Decision Needed", value: 3 },
        { name: "Pending RFC", value: 4 },
        { name: "Difficalt Issue", value: 5 }
    ];
    var subscriptionStatusEnum = [
        { name: 'Active', value: 1 },
        { name: 'Deactive', value: 2 },
        { name: 'Expired', value: 3 },
        { name: 'Locked', value: 5 },
        { name: 'Init', value: 8 },
        { name: 'Preactive', value: 9 },
        { name: 'Inactive', value: 10 },
        { name: 'Frozen', value: 11 },
        { name: 'Deleted', value: 20 },
        { name: 'Not Available', value: -1 }
    ];
    var pendingStatusEnum = [
        { name: 'Draft', value: 0 },
        { name: 'Pending', value: 1 },
        { name: 'Active', value: 2 },
        { name: 'Terminated', value: 3 },
        { name: 'Rejected', value: 4 },
        { name: 'PreActive', value: 5 },
        { name: 'Frozen', value: 6 },
        { name: 'Validating', value: 7 },
        { name: 'HybridFrozen', value: 7 }
    ];

    var subscriptionType = [
        { name: 'Single', value: 0 },
        { name: 'Parent', value: 1 },
        { name: 'Child', value: 2 },
    ];

    var ccType = [
        { name: 'Visa', value: 0 },
        { name: 'Master Card', value: 1 },
    ];

    var productTypeEnum = {
        Unassigned:0,
        Plan:1,
        Feature:2,
        Handset3G:3,
        Handset4G:4,
        MoneteryCashCard: 5,
        AllowanceCashCard: 6,
        Allowance: 7,
        SimCard: 8
    };

    var topUpPaymentTypeEnum = [
        { name: 'CASHCARD', value: 0 },
        { name: 'CREDITCARD', value: 1 },
    ];

    var deleteCustomerReasonEnum = [
        { name: 'PortOut', value: 0 },
        { name: 'Operator Requested Deactivation', value: 1 },
        { name: 'Customer Requested Deactivation', value: 2 },
        { name: 'Channel Requested Deactivation', value: 3 },
        { name: 'Charge Back', value: 4 }
    ];

    //equalTo SuspendReason
    var freezeCustomerReasonEnum = [
        { name: 'Fraud Or Lost Or Stolen Phone', value: 1 },
        { name: 'Temporarily Disconnected', value: 2 },
        { name: 'Failed Payment', value: 3 },
    ];

    //equalTo RestoreReason
    var unfreezeCustomerReasonEnum = [
        { name: 'Basic Restore', value: 0 },
        { name: 'Phone Used For Emergencies', value: 1 },
        { name: 'On Vacation', value: 2 },
        { name: 'Lost Phone Recovered', value: 3 },
        { name: 'No CDRs Coming In', value: 4 },
    ];

    var sendSMSTemplates = {
        selfcareRegistration: 'your selfcare account created successfully, please check your email for next step. thank you',
        selfcareConfirmationAccount: 'your account confirmation successfully, enjoy your selfcare.',
        selfcareActivation: 'Dear customer, welcome to #MVNO#. Your service has now been activated.'
    }

    function convert(data, param) {
        var i = $filter('filter')(data, { value: param });
        $.each(i, function (x, y) {
            if (y.value == param) {
                i = y;
            }
        });
        return i;
    }

    return {
        getCountryList: function() {
            return countryList;
        },
        convertCCType: function(param){
            return convert(ccType, param);
        },
        convertOrderStatus: function(param){
            return convert(orderStatus, param);
        },
        convertCountryList: function (param) {
            return convert(countryList, param);
        },
        getDocumentType: function() {
            return documentType;
        },
        convertDocumentType: function (param) {
            return convert(documentType, param);
        },
        getResponseCode: function() {
            return responseErrorCode;
        },
        getErrorResponseMessage: function() {
            return responseErrorMessage;
        },
        getAuthErrorCode: function() {
            return authErrorCode;
        },
        getSecurityQuestions: function () {
            return securityQuestions;
        },
        getGender: function() {
            return gender;
        },
        convertGender: function (param) {
            return convert(gender, param);
        },
        getCustomerStatus: function() {
            return customerStatus;
        },
        convertCustomerStatus: function (param) {
            return convert(customerStatus, param);
        },
        getTTSeverity: function () {
            return TTSeverity;
        },
        convertTTSeverity: function (param) {
            return convert(TTSeverity, param);
        },
        getTTIncident: function () {
            return TTIncident;
        },
        convertTTIncident: function (param) {
            return convert(TTIncident, param);
        },
        getTTStatus: function () {
            return TTStatus;
        },
        convertTTStatus: function (param) {
            return convert(TTStatus, param);
        },
        getTTScreenType: function () {
            return TTScreenType;
        },
        convertTTScreenType: function (param) {
            return convert(TTScreenType, param);
        },        
        convertSimStatus: function (param) {
            return convert(simStatus, param).name;
        },
        getPaymentType: function() {
            return paymentType;
        },
        convertPaymentType: function(param) {
            return convert(paymentType, param);
        },
        getMultiSubscriptionType: function() {
            return multiSubscriptionType;
        },
        convertMultiSubscriptionType: function (param) {
            return convert(multiSubscriptionType, param);
        },
        getSubscriptionType: function() {
            return subscriptionType;
        },
        convertSubscriptionType: function(param) {
            return convert(subscriptionType, param).name;
        },
        getCustomerBusinessType: function() {
            return customerBusinessType;
        },
        convertCustomerBusinessType: function(param) {
            return convert(customerBusinessType, param);
        },
        getSimStatus: function() {
            return simStatus;
        },
        convertUsageSubTypes: function (param) {
            return convert(usageSubTypes, param).name;
        },
        getPhoneCategory: function() {
            return phoneCategory;
        },
        getTtTagEnum: function () {
            return ttTagEnum;
        },
        convertTTTag: function (param) {
            return convert(ttTagEnum, param).name;
        },
        getTtEscalationEnum: function() {
            return ttEscalationEnum;
        },
        convertTTEscalation: function (param) {
            return convert(ttEscalationEnum, param).name;
        },
        getTtEscalationReasonEnum: function() {
            return ttEscalationReasonEnum;
        },
        convertTTEscalationReason: function (param) {
            return convert(ttEscalationReasonEnum, param).name;
        },
        convertPhoneCategory: function(param) {
            var i = $filter('filter')(phoneCategory, { value: param });
            $.each(i, function (x, y) {
                if (y.value == param) {
                    i = y;
                }
            });
            return i;
        },
        getSubscriptionStatusEnum: function()
        {
            return subscriptionStatusEnum;
        },
        convertSubscriptionStatus: function(param) {
            return convert(subscriptionStatusEnum, param).name;
        },
        convertPendingStatus: function (param) {
            return convert(pendingStatusEnum, param).name;
        },
        getProductTypeEnum: function()
        {
            return productTypeEnum;
        },
        convertTopUpPaymentTypeEnum: function (param) {
            return convert(topUpPaymentTypeEnum, param).name;
        },
        getDeleteCustomerReason: function() {
            return deleteCustomerReasonEnum;
        },
        convertDeleteCustomerReason: function(param) {
            return convert(deleteCustomerReasonEnum, param).name;
        },
        getFreezeCustomerReason: function() {
            return freezeCustomerReasonEnum;
        },
        convertFreezeCustomerReason: function(param) {
            return convert(freezeCustomerReasonEnum, param).name;
        },
        getUnfreezeCustomerReason: function() {
            return unfreezeCustomerReasonEnum;
        },
        convertUnfreezeCustomerReason: function(param) {
            return convert(unfreezeCustomerReasonEnum, param).name;
        },
        getSMSTemplates: function () {
            return sendSMSTemplates;
        }
    }
});