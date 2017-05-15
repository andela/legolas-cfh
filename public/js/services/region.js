angular.module('mean.system')
  .factory('region', ['$http', function regionService($http) {
    const region = {
      regions: [
        {
          code: 'all',
          label: 'Worldwide'
        },
        {
          code: 'afr',
          label: 'Africa'
        },
        {
          code: 'asi',
          label: 'Asia, Middle East and Oceania'
        },
        {
          code: 'eur',
          label: 'Europe'
        },
        {
          code: 'nam',
          label: 'North America, Central America and the Caribbeans'
        },
        {
          code: 'sam',
          label: 'South America'
        },
      ]
    };

    const countries = {
      Afghanistan: 'asi',
      Albania: 'eur',
      Algeria: 'afr',
      Andorra: 'eur',
      Angola: 'afr',
      'Antigua and Barbuda': 'nam',
      Argentina: 'sam',
      Armenia: 'eur',
      Australia: 'asi',
      Austria: 'eur',
      Azerbaijan: 'asi',
      Bahamas: 'nam',
      Bahrain: 'asi',
      Bangladesh: 'asi',
      Barbados: 'nam',
      Belarus: 'eur',
      Belgium: 'eur',
      Belize: 'nam',
      Benin: 'afr',
      Bhutan: 'asi',
      Bolivia: 'sam',
      'Bosnia and Herzegovina': 'eur',
      Botswana: 'afr',
      Brazil: 'sam',
      Brunei: 'asi',
      Bulgaria: 'eur',
      'Burkina Faso': 'afr',
      Burundi: 'afr',
      Cambodia: 'asi',
      Cameroon: 'afr',
      Canada: 'nam',
      'Cape Verde': 'afr',
      'Central African Republic': 'afr',
      Chad: 'afr',
      Chile: 'sam',
      China: 'asi',
      Colombia: 'sam',
      Comoros: 'afr',
      Congo: 'afr',
      'Costa Rica': 'nam',
      Croatia: 'eur',
      Cuba: 'nam',
      Cyprus: 'eur',
      'Czech Republic': 'eur',
      Denmark: 'eur',
      Djibouti: 'afr',
      Dominica: 'nam',
      'Dominican Republic': 'nam',
      'East Timor': 'asi',
      Ecuador: 'sam',
      Egypt: 'afr',
      'El Salvador': 'nam',
      'Equatorial Guinea': 'afr',
      Eritrea: 'afr',
      Estonia: 'eur',
      Ethiopia: 'afr',
      'Federated States of Micronesia': 'asi',
      Fiji: 'asi',
      Finland: 'eur',
      France: 'eur',
      Gabon: 'afr',
      Gambia: 'afr',
      Georgia: 'eur',
      Germany: 'eur',
      Ghana: 'afr',
      Greece: 'eur',
      Greenland: 'nam',
      Guatemala: 'nam',
      Guinea: 'afr',
      'Guinea-Bissau': 'afr',
      Guyana: 'sam',
      Haiti: 'nam',
      Honduras: 'nam',
      Hungary: 'eur',
      Iceland: 'eur',
      India: 'asi',
      Indonesia: 'asi',
      Iran: 'asi',
      Iraq: 'asi',
      Ireland: 'eur',
      Israel: 'eur',
      Italy: 'eur',
      'Ivory Coast': 'afr',
      Jamaica: 'nam',
      Japan: 'asi',
      Jordan: 'asi',
      Kazakhstan: 'asi',
      Kenya: 'afr',
      Kiribati: 'asi',
      Kosovo: 'eur',
      Kuwait: 'asi',
      Kyrgyzstan: 'asi',
      Laos: 'asi',
      Latvia: 'eur',
      Lebanon: 'asi',
      Lesotho: 'afr',
      Liberia: 'afr',
      Libya: 'afr',
      Liechtenstein: 'eur',
      Lithuania: 'eur',
      Luxembourg: 'eur',
      Macedonia: 'eur',
      Madagascar: 'afr',
      Malawi: 'afr',
      Malaysia: 'asi',
      Maldives: 'asi',
      Mali: 'afr',
      Malta: 'eur',
      'Marshall Islands': 'asi',
      Mauritania: 'afr',
      Mauritius: 'afr',
      Mexico: 'nam',
      Moldova: 'eur',
      Monaco: 'eur',
      Mongolia: 'asi',
      Montenegro: 'eur',
      Morocco: 'afr',
      Mozambique: 'afr',
      Myanmar: 'asi',
      Namibia: 'afr',
      Nauru: 'asi',
      Nepal: 'asi',
      Netherlands: 'eur',
      'New Zealand': 'asi',
      Nicaragua: 'nam',
      Niger: 'afr',
      Nigeria: 'afr',
      'North Korea': 'asi',
      Norway: 'eur',
      Oman: 'asi',
      Pakistan: 'asi',
      Palau: 'asi',
      Panama: 'nam',
      'Papua New Guinea': 'asi',
      Paraguay: 'sam',
      Peru: 'sam',
      Philippines: 'asi',
      Poland: 'eur',
      Portugal: 'eur',
      Qatar: 'asi',
      'Republic of the Congo': 'afr',
      Romania: 'eur',
      Russia: 'eur',
      Rwanda: 'afr',
      'Saint Kitts and Nevis': 'nam',
      'Saint Lucia': 'nam',
      'Saint Vincent and the Grenadines': 'nam',
      Samoa: 'asi',
      'San Marino': 'eur',
      'Sao Tome and Principe': 'afr',
      'Saudi Arabia': 'asi',
      Senegal: 'afr',
      Serbia: 'eur',
      Seychelles: 'afr',
      'Sierra Leone': 'afr',
      Singapore: 'asi',
      Slovakia: 'eur',
      Slovenia: 'eur',
      'Solomon Islands': 'asi',
      Somalia: 'afr',
      'South Africa': 'afr',
      'South Korea': 'asi',
      'South Sudan': 'afr',
      Spain: 'eur',
      'Sri Lanka': 'asi',
      Sudan: 'afr',
      Suriname: 'sam',
      Swaziland: 'afr',
      Sweden: 'eur',
      Switzerland: 'eur',
      Syria: 'asi',
      Taiwan: 'asi',
      Tajikistan: 'asi',
      Tanzania: 'afr',
      Thailand: 'asi',
      Togo: 'afr',
      Tonga: 'asi',
      'Trinidad and Tobago': 'nam',
      Tunisia: 'men',
      Turkey: 'asi',
      Turkmenistan: 'asi',
      Tuvalu: 'asi',
      Uganda: 'afr',
      Ukraine: 'eur',
      'United Arab Emirates': 'asi',
      'United Kingdom': 'eur',
      'United States': 'nam',
      Uruguay: 'sam',
      Uzbekistan: 'asi',
      Vanuatu: 'asi',
      'Vatican City': 'eur',
      Venezuela: 'sam',
      Vietnam: 'asi',
      Yemen: 'asi',
      Zambia: 'afr',
      Zimbabwe: 'afr'
    };

    region.getSelectedRegion = () => (
      new Promise((resolve) => {
        $http.get('http://freegeoip.net/json/')
        .then((res) => {
          console.log(res.data.country_name);
          if (Object.prototype.hasOwnProperty.call(countries, res.data.country_name)) {
            switch (countries[res.data.country_name]) {
              case 'afr':
                resolve(region.regions[1]);
                break;
              case 'asi':
                resolve(region.regions[2]);
                break;
              case 'eur':
                resolve(region.regions[3]);
                break;
              case 'nam':
                resolve(region.regions[4]);
                break;
              case 'sam':
                resolve(region.regions[5]);
                break;
              default:
                resolve(region.regions[0]);
                break;
            }
          }
        }, (err) => {
          console.log(err);
          resolve(region.regions[0]);
        });
      })
    );

    return region;
  }]);
