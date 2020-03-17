function ajax1() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/masks.php",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "f87d8b7daemsh99560a3534f1f1ap14d466jsn01568a97fbdf"
        },
        "beforeSend": function (xhr) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        },
        "success": function (result, textStatus, jqXHR) {
            if (result.length < 1) {
                alert("The thumbnail doesn't exist");
                $("#infoImg").attr("src", "data:image/png;base64,");
                return
            }

            var binary = "";
            var responseText = jqXHR.responseText;
            var responseTextLen = responseText.length;

            for (i = 0; i < responseTextLen; i++) {
                binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
            }
            $("#infoImg").attr("src", "data:image/png;base64," + btoa(binary));
        },
        "error": function (xhr, textStatus, errorThrown) {
            alert("Error in getting document " + textStatus);
        }
    }

    function b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    $.ajax(settings).done(function (response) {
        // console.log(response);
    });
}
ajax1()

var total = [0, 0, 0, 0]
var dict = new Object()

function drawChartTimeseries() {

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }


    var values = [
        [],
        [],
        [],
        [],
        []
    ]
    var count = 0
    var dictCountry = {}
    var dictTime = {}
    var dictConverTime = {}
    var nowH = new Date()
    nowH = (nowH.getMonth() + 1) + '/' + nowH.getDate() + '/' + nowH.getFullYear().toString().substr(-2)
    var nowDateT = nowH.split('/')
    var nowTimeH = new Date(nowH).getTime()
    dictConverTime[nowTimeH] = nowDateT[1] + '/' + nowDateT[0] + '/' + nowDateT[2]

    for (var i = 0; i < data.confirmed.locations.length; i++) {
        count = 0
        dictCountry[data.confirmed.locations[i].country] = true
        if (data.confirmed.locations[i].country == document.getElementById('dropdownCountry').value || document.getElementById('dropdownCountry').value.length == 0 || document.getElementById('dropdownCountry').value == 'Global') {
            var tempConfirmed = {}
            var tempDeaths = {}
            var tempRecovered = {}
            var temp2Confirmed = {}
            var temp2Deaths = {}
            var temp2Recovered = {}
            for (var h in data.confirmed.locations[i].history) {
                var dateT = h.split('/')
                var timeH = new Date(h).getTime()
                dictConverTime[timeH] = dateT[1] + '/' + dateT[0] + '/' + dateT[2]
                temp2Confirmed[timeH] = data.confirmed.locations[i].history[h]
                temp2Deaths[timeH] = data.deaths.locations[i].history[h]
                temp2Recovered[timeH] = data.recovered.locations[i].history[h]
            }
            Object.keys(temp2Confirmed).sort().forEach(function (key) {
                tempConfirmed[key] = temp2Confirmed[key];
                tempDeaths[key] = temp2Deaths[key];
                tempRecovered[key] = temp2Recovered[key];
            });
            var antD = 0
            var count2 = 1
            for (var element in tempConfirmed) {
                count++
                if (values[0][element] == null)
                    values[0][element] = 0
                if (values[1][element] == null)
                    values[1][element] = 0
                if (values[2][element] == null)
                    values[2][element] = 0
                if (values[3][element] == null)
                    values[3][element] = 0
                if (values[4][element] == null)
                    values[4][element] = 0
                if (tempConfirmed[element])
                    values[0][element] += parseInt(tempConfirmed[element])
                if (tempDeaths[element])
                    values[2][element] += parseInt(tempDeaths[element])
                if (tempRecovered[element])
                    values[3][element] += parseInt(tempRecovered[element])
                if (tempRecovered[element] && tempConfirmed[element] && tempDeaths[element])
                    values[1][element] += parseInt(tempConfirmed[element]) - parseInt(tempRecovered[element]) - parseInt(tempDeaths[element])
                if (antD == 0) {
                    count2 = 1
                    values[4][element] = 0
                } else {
                    values[4][element] = 1.7926 * Math.pow(1.3752, count2)
                }
                antD = values[1][element]
                count2++
            }
        }
    }
    var temp = []
    var i = 0
    if (document.getElementById('dropdownCountry').value == 'Global') {
        values[0][nowTimeH] = total[0]
        values[1][nowTimeH] = total[1]
        values[2][nowTimeH] = total[2]
        values[3][nowTimeH] = total[3]
    }
    // console.log(dict)
    for (var element in values) {
        if (document.getElementById('dropdownCountry').value != 'Global') {
            if (dict[document.getElementById('dropdownCountry').value] == undefined) {
                // console.log(document.getElementById('dropdownCountry').value)
                var tempCountry = null
                if (document.getElementById('dropdownCountry').value == 'United Arab Emirates')
                    tempCountry = 'UAE'
                else if (document.getElementById('dropdownCountry').value == 'United Kingdom')
                    tempCountry = 'UK'
                else if (document.getElementById('dropdownCountry').value == 'Korea, South')
                    tempCountry = 'S. Korea'
                else if (document.getElementById('dropdownCountry').value == 'Korea, North')
                    tempCountry = 'N. Korea'
                else if (document.getElementById('dropdownCountry').value == 'Taiwan*')
                    tempCountry = 'Taiwan'
                else if (document.getElementById('dropdownCountry').value == 'US')
                    tempCountry = 'USA'
                else if (document.getElementById('dropdownCountry').value == 'Curacao')
                    tempCountry = 'Curaçao'
                if (tempCountry != null) {
                    values[element][nowTimeH] = dict[tempCountry][element]
                    document.getElementById('confirmedNCountry').innerHTML = values[0][nowTimeH] + ' (+' + dict[tempCountry][4] + ')'
                    document.getElementById('infectedNCountry').innerHTML = values[1][nowTimeH]
                    document.getElementById('deathsNCountry').innerHTML = values[2][nowTimeH] + ' (+' + dict[tempCountry][5] + ')'
                    document.getElementById('recoveredNCountry').innerHTML = values[3][nowTimeH]
                } else {
                    document.getElementById('confirmedNCountry').innerHTML = '-'
                    document.getElementById('infectedNCountry').innerHTML = '-'
                    document.getElementById('deathsNCountry').innerHTML = '-'
                    document.getElementById('recoveredNCountry').innerHTML = '-'
                }
            } else {
                values[element][nowTimeH] = dict[document.getElementById('dropdownCountry').value][element]
                document.getElementById('confirmedNCountry').innerHTML = values[0][nowTimeH] + ' (+' + dict[document.getElementById('dropdownCountry').value][4] + ')'
                document.getElementById('infectedNCountry').innerHTML = values[1][nowTimeH]
                document.getElementById('deathsNCountry').innerHTML = values[2][nowTimeH] + ' (+' + dict[document.getElementById('dropdownCountry').value][5] + ')'
                document.getElementById('recoveredNCountry').innerHTML = values[3][nowTimeH]
            }
        } else {
            document.getElementById('confirmedNCountry').innerHTML = document.getElementById('confirmedN').innerHTML
            document.getElementById('infectedNCountry').innerHTML = document.getElementById('infectedN').innerHTML
            document.getElementById('deathsNCountry').innerHTML = document.getElementById('deathsN').innerHTML
            document.getElementById('recoveredNCountry').innerHTML = document.getElementById('recoveredN').innerHTML
        }
        var temp2 = []
        var j = 0
        for (var element2 in values[element]) {
            dictTime[element2] = true
            temp2[j] = values[element][element2]
            j++
        }
        temp[i] = temp2
        i++
    }
    for (var k = 0; k < temp[0].length; k++) {
        temp[1][k] = temp[0][k] - temp[2][k] - temp[3][k]
    }
    values = temp
    var labels = []
    for (var timeElement in dictTime) {
        labels.push(dictConverTime[timeElement])
    }

    for (var countryElement in dictCountry) {
        var option = document.createElement('option')
        var text = document.createTextNode(countryElement)
        option.append(text)
        document.getElementById('dropdownCountry').append(option)
    }

    Chart.defaults.global.defaultFontColor = '#858796';

    function number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    document.getElementById('myAreaChart').innerHTML = ""
    var ctx = document.createElement('canvas');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                    label: "Confirmed",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#36b9cc",
                    pointRadius: 3,
                    pointBackgroundColor: "#36b9cc",
                    pointBorderColor: "#36b9cc",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "#36b9cc",
                    pointHoverBorderColor: "#36b9cc",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: values[0],
                },
                {
                    label: "Infected",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#f6c23e",
                    pointRadius: 3,
                    pointBackgroundColor: "#f6c23e",
                    pointBorderColor: "#f6c23e",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "#f6c23e",
                    pointHoverBorderColor: "#f6c23e",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: values[1],
                },
                {
                    label: "Deaths",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#e74a3b",
                    pointRadius: 3,
                    pointBackgroundColor: "#e74a3b",
                    pointBorderColor: "#e74a3b",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "#e74a3b",
                    pointHoverBorderColor: "#e74a3b",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: values[2],
                },
                {
                    label: "Recovered",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#1cc88a",
                    pointRadius: 3,
                    pointBackgroundColor: "#1cc88a",
                    pointBorderColor: "#1cc88a",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "#1cc88a",
                    pointHoverBorderColor: "#1cc88a",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: values[3],
                }
                //, {
                //     label: "Forecast",
                //     lineTension: 0.3,
                //     backgroundColor: "rgba(78, 115, 223, 0.05)",
                //     borderColor: "#6f42c1",
                //     pointRadius: 3,
                //     pointBackgroundColor: "#6f42c1",
                //     pointBorderColor: "#6f42c1",
                //     pointHoverRadius: 3,
                //     pointHoverBackgroundColor: "#6f42c1",
                //     pointHoverBorderColor: "#6f42c1",
                //     pointHitRadius: 10,
                //     pointBorderWidth: 2,
                //     data: values[4],
                // }
            ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        callback: function (value, index, values) {
                            return number_format(value);
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                    }
                }
            }
        }
    });
    document.getElementById('myAreaChart').append(ctx)
}

function ajax4() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-tracker-api.herokuapp.com/all",
        "method": "GET",
        "headers": {
            "Accept": "application/json"
        }
    }

    $.ajax(settings).done(function (response) {
        data = response
        drawChartTimeseries()
    });

}

function ajax3() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "f87d8b7daemsh99560a3534f1f1ap14d466jsn01568a97fbdf"
        }
    }

    $.ajax(settings).done(function (data) {
        data = $.parseJSON(data);
        for (country in data.countries_stat) {
            dict[data.countries_stat[country].country_name] = [parseInt(data.countries_stat[country].cases.replace(',', '')),
                parseInt(data.countries_stat[country].serious_critical.replace(',', '')),
                parseInt(data.countries_stat[country].deaths.replace(',', '')),
                parseInt(data.countries_stat[country].total_recovered.replace(',', '')),
                parseInt(data.countries_stat[country].new_cases.replace(',', '')),
                parseInt(data.countries_stat[country].new_deaths.replace(',', ''))
            ]
        }
        var latlong = {};
        latlong.AD = {
            'latitude': 42.5,
            'longitude': 1.5
        };
        latlong.AE = {
            'latitude': 24,
            'longitude': 54
        };
        latlong.AF = {
            'latitude': 33,
            'longitude': 65
        };
        latlong.AG = {
            'latitude': 17.05,
            'longitude': -61.8
        };
        latlong.AI = {
            'latitude': 18.25,
            'longitude': -63.1667
        };
        latlong.AL = {
            'latitude': 41,
            'longitude': 20
        };
        latlong.AM = {
            'latitude': 40,
            'longitude': 45
        };
        latlong.AN = {
            'latitude': 12.25,
            'longitude': -68.75
        };
        latlong.AO = {
            'latitude': -12.5,
            'longitude': 18.5
        };
        latlong.AP = {
            'latitude': 35,
            'longitude': 105
        };
        latlong.AQ = {
            'latitude': -90,
            'longitude': 0
        };
        latlong.AR = {
            'latitude': -34,
            'longitude': -64
        };
        latlong.AS = {
            'latitude': -14.3333,
            'longitude': -170
        };
        latlong.AT = {
            'latitude': 47.3333,
            'longitude': 13.3333
        };
        latlong.AU = {
            'latitude': -27,
            'longitude': 133
        };
        latlong.AW = {
            'latitude': 12.5,
            'longitude': -69.9667
        };
        latlong.AZ = {
            'latitude': 40.5,
            'longitude': 47.5
        };
        latlong.BA = {
            'latitude': 44,
            'longitude': 18
        };
        latlong.BB = {
            'latitude': 13.1667,
            'longitude': -59.5333
        };
        latlong.BD = {
            'latitude': 24,
            'longitude': 90
        };
        latlong.BE = {
            'latitude': 50.8333,
            'longitude': 4
        };
        latlong.BF = {
            'latitude': 13,
            'longitude': -2
        };
        latlong.BG = {
            'latitude': 43,
            'longitude': 25
        };
        latlong.BH = {
            'latitude': 26,
            'longitude': 50.55
        };
        latlong.BI = {
            'latitude': -3.5,
            'longitude': 30
        };
        latlong.BJ = {
            'latitude': 9.5,
            'longitude': 2.25
        };
        latlong.BM = {
            'latitude': 32.3333,
            'longitude': -64.75
        };
        latlong.BN = {
            'latitude': 4.5,
            'longitude': 114.6667
        };
        latlong.BO = {
            'latitude': -17,
            'longitude': -65
        };
        latlong.BR = {
            'latitude': -10,
            'longitude': -55
        };
        latlong.BS = {
            'latitude': 24.25,
            'longitude': -76
        };
        latlong.BT = {
            'latitude': 27.5,
            'longitude': 90.5
        };
        latlong.BV = {
            'latitude': -54.4333,
            'longitude': 3.4
        };
        latlong.BW = {
            'latitude': -22,
            'longitude': 24
        };
        latlong.BY = {
            'latitude': 53,
            'longitude': 28
        };
        latlong.BZ = {
            'latitude': 17.25,
            'longitude': -88.75
        };
        latlong.CA = {
            'latitude': 54,
            'longitude': -100
        };
        latlong.CC = {
            'latitude': -12.5,
            'longitude': 96.8333
        };
        latlong.CD = {
            'latitude': 0,
            'longitude': 25
        };
        latlong.CF = {
            'latitude': 7,
            'longitude': 21
        };
        latlong.CG = {
            'latitude': -1,
            'longitude': 15
        };
        latlong.CH = {
            'latitude': 47,
            'longitude': 8
        };
        latlong.CI = {
            'latitude': 8,
            'longitude': -5
        };
        latlong.CK = {
            'latitude': -21.2333,
            'longitude': -159.7667
        };
        latlong.CL = {
            'latitude': -30,
            'longitude': -71
        };
        latlong.CM = {
            'latitude': 6,
            'longitude': 12
        };
        latlong.CN = {
            'latitude': 35,
            'longitude': 105
        };
        latlong.CO = {
            'latitude': 4,
            'longitude': -72
        };
        latlong.CR = {
            'latitude': 10,
            'longitude': -84
        };
        latlong.CU = {
            'latitude': 21.5,
            'longitude': -80
        };
        latlong.CV = {
            'latitude': 16,
            'longitude': -24
        };
        latlong.CX = {
            'latitude': -10.5,
            'longitude': 105.6667
        };
        latlong.CY = {
            'latitude': 35,
            'longitude': 33
        };
        latlong.CZ = {
            'latitude': 49.75,
            'longitude': 15.5
        };
        latlong.DE = {
            'latitude': 51,
            'longitude': 9
        };
        latlong.DJ = {
            'latitude': 11.5,
            'longitude': 43
        };
        latlong.DK = {
            'latitude': 56,
            'longitude': 10
        };
        latlong.DM = {
            'latitude': 15.4167,
            'longitude': -61.3333
        };
        latlong.DO = {
            'latitude': 19,
            'longitude': -70.6667
        };
        latlong.DZ = {
            'latitude': 28,
            'longitude': 3
        };
        latlong.EC = {
            'latitude': -2,
            'longitude': -77.5
        };
        latlong.EE = {
            'latitude': 59,
            'longitude': 26
        };
        latlong.EG = {
            'latitude': 27,
            'longitude': 30
        };
        latlong.EH = {
            'latitude': 24.5,
            'longitude': -13
        };
        latlong.ER = {
            'latitude': 15,
            'longitude': 39
        };
        latlong.ES = {
            'latitude': 40,
            'longitude': -4
        };
        latlong.ET = {
            'latitude': 8,
            'longitude': 38
        };
        latlong.EU = {
            'latitude': 47,
            'longitude': 8
        };
        latlong.FI = {
            'latitude': 62,
            'longitude': 26
        };
        latlong.FJ = {
            'latitude': -18,
            'longitude': 175
        };
        latlong.FK = {
            'latitude': -51.75,
            'longitude': -59
        };
        latlong.FM = {
            'latitude': 6.9167,
            'longitude': 158.25
        };
        latlong.FO = {
            'latitude': 62,
            'longitude': -7
        };
        latlong.FR = {
            'latitude': 46,
            'longitude': 2
        };
        latlong.GA = {
            'latitude': -1,
            'longitude': 11.75
        };
        latlong.GB = {
            'latitude': 54,
            'longitude': -2
        };
        latlong.GD = {
            'latitude': 12.1167,
            'longitude': -61.6667
        };
        latlong.GE = {
            'latitude': 42,
            'longitude': 43.5
        };
        latlong.GF = {
            'latitude': 4,
            'longitude': -53
        };
        latlong.GH = {
            'latitude': 8,
            'longitude': -2
        };
        latlong.GI = {
            'latitude': 36.1833,
            'longitude': -5.3667
        };
        latlong.GL = {
            'latitude': 72,
            'longitude': -40
        };
        latlong.GM = {
            'latitude': 13.4667,
            'longitude': -16.5667
        };
        latlong.GN = {
            'latitude': 11,
            'longitude': -10
        };
        latlong.GP = {
            'latitude': 16.25,
            'longitude': -61.5833
        };
        latlong.GQ = {
            'latitude': 2,
            'longitude': 10
        };
        latlong.GR = {
            'latitude': 39,
            'longitude': 22
        };
        latlong.GS = {
            'latitude': -54.5,
            'longitude': -37
        };
        latlong.GT = {
            'latitude': 15.5,
            'longitude': -90.25
        };
        latlong.GU = {
            'latitude': 13.4667,
            'longitude': 144.7833
        };
        latlong.GW = {
            'latitude': 12,
            'longitude': -15
        };
        latlong.GY = {
            'latitude': 5,
            'longitude': -59
        };
        latlong.HK = {
            'latitude': 22.25,
            'longitude': 114.1667
        };
        latlong.HM = {
            'latitude': -53.1,
            'longitude': 72.5167
        };
        latlong.HN = {
            'latitude': 15,
            'longitude': -86.5
        };
        latlong.HR = {
            'latitude': 45.1667,
            'longitude': 15.5
        };
        latlong.HT = {
            'latitude': 19,
            'longitude': -72.4167
        };
        latlong.HU = {
            'latitude': 47,
            'longitude': 20
        };
        latlong.ID = {
            'latitude': -5,
            'longitude': 120
        };
        latlong.IE = {
            'latitude': 53,
            'longitude': -8
        };
        latlong.IL = {
            'latitude': 31.5,
            'longitude': 34.75
        };
        latlong.IN = {
            'latitude': 20,
            'longitude': 77
        };
        latlong.IO = {
            'latitude': -6,
            'longitude': 71.5
        };
        latlong.IQ = {
            'latitude': 33,
            'longitude': 44
        };
        latlong.IR = {
            'latitude': 32,
            'longitude': 53
        };
        latlong.IS = {
            'latitude': 65,
            'longitude': -18
        };
        latlong.IT = {
            'latitude': 42.8333,
            'longitude': 12.8333
        };
        latlong.JM = {
            'latitude': 18.25,
            'longitude': -77.5
        };
        latlong.JO = {
            'latitude': 31,
            'longitude': 36
        };
        latlong.JP = {
            'latitude': 36,
            'longitude': 138
        };
        latlong.KE = {
            'latitude': 1,
            'longitude': 38
        };
        latlong.KG = {
            'latitude': 41,
            'longitude': 75
        };
        latlong.KH = {
            'latitude': 13,
            'longitude': 105
        };
        latlong.KI = {
            'latitude': 1.4167,
            'longitude': 173
        };
        latlong.KM = {
            'latitude': -12.1667,
            'longitude': 44.25
        };
        latlong.KN = {
            'latitude': 17.3333,
            'longitude': -62.75
        };
        latlong.KP = {
            'latitude': 40,
            'longitude': 127
        };
        latlong.KR = {
            'latitude': 37,
            'longitude': 127.5
        };
        latlong.KW = {
            'latitude': 29.3375,
            'longitude': 47.6581
        };
        latlong.KY = {
            'latitude': 19.5,
            'longitude': -80.5
        };
        latlong.KZ = {
            'latitude': 48,
            'longitude': 68
        };
        latlong.LA = {
            'latitude': 18,
            'longitude': 105
        };
        latlong.LB = {
            'latitude': 33.8333,
            'longitude': 35.8333
        };
        latlong.LC = {
            'latitude': 13.8833,
            'longitude': -61.1333
        };
        latlong.LI = {
            'latitude': 47.1667,
            'longitude': 9.5333
        };
        latlong.LK = {
            'latitude': 7,
            'longitude': 81
        };
        latlong.LR = {
            'latitude': 6.5,
            'longitude': -9.5
        };
        latlong.LS = {
            'latitude': -29.5,
            'longitude': 28.5
        };
        latlong.LT = {
            'latitude': 55,
            'longitude': 24
        };
        latlong.LU = {
            'latitude': 49.75,
            'longitude': 6
        };
        latlong.LV = {
            'latitude': 57,
            'longitude': 25
        };
        latlong.LY = {
            'latitude': 25,
            'longitude': 17
        };
        latlong.MA = {
            'latitude': 32,
            'longitude': -5
        };
        latlong.MC = {
            'latitude': 43.7333,
            'longitude': 7.4
        };
        latlong.MD = {
            'latitude': 47,
            'longitude': 29
        };
        latlong.ME = {
            'latitude': 42.5,
            'longitude': 19.4
        };
        latlong.MG = {
            'latitude': -20,
            'longitude': 47
        };
        latlong.MH = {
            'latitude': 9,
            'longitude': 168
        };
        latlong.MK = {
            'latitude': 41.8333,
            'longitude': 22
        };
        latlong.ML = {
            'latitude': 17,
            'longitude': -4
        };
        latlong.MM = {
            'latitude': 22,
            'longitude': 98
        };
        latlong.MN = {
            'latitude': 46,
            'longitude': 105
        };
        latlong.MO = {
            'latitude': 22.1667,
            'longitude': 113.55
        };
        latlong.MP = {
            'latitude': 15.2,
            'longitude': 145.75
        };
        latlong.MQ = {
            'latitude': 14.6667,
            'longitude': -61
        };
        latlong.MR = {
            'latitude': 20,
            'longitude': -12
        };
        latlong.MS = {
            'latitude': 16.75,
            'longitude': -62.2
        };
        latlong.MT = {
            'latitude': 35.8333,
            'longitude': 14.5833
        };
        latlong.MU = {
            'latitude': -20.2833,
            'longitude': 57.55
        };
        latlong.MV = {
            'latitude': 3.25,
            'longitude': 73
        };
        latlong.MW = {
            'latitude': -13.5,
            'longitude': 34
        };
        latlong.MX = {
            'latitude': 23,
            'longitude': -102
        };
        latlong.MY = {
            'latitude': 2.5,
            'longitude': 112.5
        };
        latlong.MZ = {
            'latitude': -18.25,
            'longitude': 35
        };
        latlong.NA = {
            'latitude': -22,
            'longitude': 17
        };
        latlong.NC = {
            'latitude': -21.5,
            'longitude': 165.5
        };
        latlong.NE = {
            'latitude': 16,
            'longitude': 8
        };
        latlong.NF = {
            'latitude': -29.0333,
            'longitude': 167.95
        };
        latlong.NG = {
            'latitude': 10,
            'longitude': 8
        };
        latlong.NI = {
            'latitude': 13,
            'longitude': -85
        };
        latlong.NL = {
            'latitude': 52.5,
            'longitude': 5.75
        };
        latlong.NO = {
            'latitude': 62,
            'longitude': 10
        };
        latlong.NP = {
            'latitude': 28,
            'longitude': 84
        };
        latlong.NR = {
            'latitude': -0.5333,
            'longitude': 166.9167
        };
        latlong.NU = {
            'latitude': -19.0333,
            'longitude': -169.8667
        };
        latlong.NZ = {
            'latitude': -41,
            'longitude': 174
        };
        latlong.OM = {
            'latitude': 21,
            'longitude': 57
        };
        latlong.PA = {
            'latitude': 9,
            'longitude': -80
        };
        latlong.PE = {
            'latitude': -10,
            'longitude': -76
        };
        latlong.PF = {
            'latitude': -15,
            'longitude': -140
        };
        latlong.PG = {
            'latitude': -6,
            'longitude': 147
        };
        latlong.PH = {
            'latitude': 13,
            'longitude': 122
        };
        latlong.PK = {
            'latitude': 30,
            'longitude': 70
        };
        latlong.PL = {
            'latitude': 52,
            'longitude': 20
        };
        latlong.PM = {
            'latitude': 46.8333,
            'longitude': -56.3333
        };
        latlong.PR = {
            'latitude': 18.25,
            'longitude': -66.5
        };
        latlong.PS = {
            'latitude': 32,
            'longitude': 35.25
        };
        latlong.PT = {
            'latitude': 39.5,
            'longitude': -8
        };
        latlong.PW = {
            'latitude': 7.5,
            'longitude': 134.5
        };
        latlong.PY = {
            'latitude': -23,
            'longitude': -58
        };
        latlong.QA = {
            'latitude': 25.5,
            'longitude': 51.25
        };
        latlong.RE = {
            'latitude': -21.1,
            'longitude': 55.6
        };
        latlong.RO = {
            'latitude': 46,
            'longitude': 25
        };
        latlong.RS = {
            'latitude': 44,
            'longitude': 21
        };
        latlong.RU = {
            'latitude': 60,
            'longitude': 100
        };
        latlong.RW = {
            'latitude': -2,
            'longitude': 30
        };
        latlong.SA = {
            'latitude': 25,
            'longitude': 45
        };
        latlong.SB = {
            'latitude': -8,
            'longitude': 159
        };
        latlong.SC = {
            'latitude': -4.5833,
            'longitude': 55.6667
        };
        latlong.SD = {
            'latitude': 15,
            'longitude': 30
        };
        latlong.SE = {
            'latitude': 62,
            'longitude': 15
        };
        latlong.SG = {
            'latitude': 1.3667,
            'longitude': 103.8
        };
        latlong.SH = {
            'latitude': -15.9333,
            'longitude': -5.7
        };
        latlong.SI = {
            'latitude': 46,
            'longitude': 15
        };
        latlong.SJ = {
            'latitude': 78,
            'longitude': 20
        };
        latlong.SK = {
            'latitude': 48.6667,
            'longitude': 19.5
        };
        latlong.SL = {
            'latitude': 8.5,
            'longitude': -11.5
        };
        latlong.SM = {
            'latitude': 43.7667,
            'longitude': 12.4167
        };
        latlong.SN = {
            'latitude': 14,
            'longitude': -14
        };
        latlong.SO = {
            'latitude': 10,
            'longitude': 49
        };
        latlong.SR = {
            'latitude': 4,
            'longitude': -56
        };
        latlong.ST = {
            'latitude': 1,
            'longitude': 7
        };
        latlong.SV = {
            'latitude': 13.8333,
            'longitude': -88.9167
        };
        latlong.SY = {
            'latitude': 35,
            'longitude': 38
        };
        latlong.SZ = {
            'latitude': -26.5,
            'longitude': 31.5
        };
        latlong.TC = {
            'latitude': 21.75,
            'longitude': -71.5833
        };
        latlong.TD = {
            'latitude': 15,
            'longitude': 19
        };
        latlong.TF = {
            'latitude': -43,
            'longitude': 67
        };
        latlong.TG = {
            'latitude': 8,
            'longitude': 1.1667
        };
        latlong.TH = {
            'latitude': 15,
            'longitude': 100
        };
        latlong.TJ = {
            'latitude': 39,
            'longitude': 71
        };
        latlong.TK = {
            'latitude': -9,
            'longitude': -172
        };
        latlong.TM = {
            'latitude': 40,
            'longitude': 60
        };
        latlong.TN = {
            'latitude': 34,
            'longitude': 9
        };
        latlong.TO = {
            'latitude': -20,
            'longitude': -175
        };
        latlong.TR = {
            'latitude': 39,
            'longitude': 35
        };
        latlong.TT = {
            'latitude': 11,
            'longitude': -61
        };
        latlong.TV = {
            'latitude': -8,
            'longitude': 178
        };
        latlong.TW = {
            'latitude': 23.5,
            'longitude': 121
        };
        latlong.TZ = {
            'latitude': -6,
            'longitude': 35
        };
        latlong.UA = {
            'latitude': 49,
            'longitude': 32
        };
        latlong.UG = {
            'latitude': 1,
            'longitude': 32
        };
        latlong.UM = {
            'latitude': 19.2833,
            'longitude': 166.6
        };
        latlong.US = {
            'latitude': 38,
            'longitude': -97
        };
        latlong.UY = {
            'latitude': -33,
            'longitude': -56
        };
        latlong.UZ = {
            'latitude': 41,
            'longitude': 64
        };
        latlong.VA = {
            'latitude': 41.9,
            'longitude': 12.45
        };
        latlong.VC = {
            'latitude': 13.25,
            'longitude': -61.2
        };
        latlong.VE = {
            'latitude': 8,
            'longitude': -66
        };
        latlong.VG = {
            'latitude': 18.5,
            'longitude': -64.5
        };
        latlong.VI = {
            'latitude': 18.3333,
            'longitude': -64.8333
        };
        latlong.VN = {
            'latitude': 16,
            'longitude': 106
        };
        latlong.VU = {
            'latitude': -16,
            'longitude': 167
        };
        latlong.WF = {
            'latitude': -13.3,
            'longitude': -176.2
        };
        latlong.WS = {
            'latitude': -13.5833,
            'longitude': -172.3333
        };
        latlong.YE = {
            'latitude': 15,
            'longitude': 48
        };
        latlong.YT = {
            'latitude': -12.8333,
            'longitude': 45.1667
        };
        latlong.ZA = {
            'latitude': -29,
            'longitude': 24
        };
        latlong.ZM = {
            'latitude': -15,
            'longitude': 30
        };
        latlong.ZW = {
            'latitude': -20,
            'longitude': 30
        };
        var mapData = [{
                'code': 'AF',
                'name': 'Afghanistan'
            },
            {
                'code': 'AL',
                'name': 'Albania'
            },
            {
                'code': 'DZ',
                'name': 'Algeria'
            },
            {
                'code': 'AO',
                'name': 'Angola'
            },
            {
                'code': 'AR',
                'name': 'Argentina'
            },
            {
                'code': 'AM',
                'name': 'Armenia'
            },
            {
                'code': 'AU',
                'name': 'Australia'
            },
            {
                'code': 'AT',
                'name': 'Austria'
            },
            {
                'code': 'AZ',
                'name': 'Azerbaijan'
            },
            {
                'code': 'BH',
                'name': 'Bahrain'
            },
            {
                'code': 'BD',
                'name': 'Bangladesh'
            },
            {
                'code': 'BY',
                'name': 'Belarus'
            },
            {
                'code': 'BE',
                'name': 'Belgium'
            },
            {
                'code': 'BJ',
                'name': 'Benin'
            },
            {
                'code': 'BT',
                'name': 'Bhutan'
            },
            {
                'code': 'BO',
                'name': 'Bolivia'
            },
            {
                'code': 'BA',
                'name': 'Bosnia and Herzegovina'
            },
            {
                'code': 'BW',
                'name': 'Botswana'
            },
            {
                'code': 'BR',
                'name': 'Brazil'
            },
            {
                'code': 'BN',
                'name': 'Brunei'
            },
            {
                'code': 'BG',
                'name': 'Bulgaria'
            },
            {
                'code': 'BF',
                'name': 'Burkina Faso'
            },
            {
                'code': 'BI',
                'name': 'Burundi'
            },
            {
                'code': 'KH',
                'name': 'Cambodia'
            },
            {
                'code': 'CM',
                'name': 'Cameroon'
            },
            {
                'code': 'CA',
                'name': 'Canada'
            },
            {
                'code': 'CV',
                'name': 'Cape Verde'
            },
            {
                'code': 'CF',
                'name': 'Central African Republic'
            },
            {
                'code': 'TD',
                'name': 'Chad'
            },
            {
                'code': 'CL',
                'name': 'Chile'
            },
            {
                'code': 'CN',
                'name': 'China'
            },
            {
                'code': 'CO',
                'name': 'Colombia'
            },
            {
                'code': 'KM',
                'name': 'Comoros'
            },
            {
                'code': 'CD',
                'name': 'Congo (Kinshasa)'
            },
            {
                'code': 'CG',
                'name': 'Congo (Brazzaville)'
            },
            {
                'code': 'CR',
                'name': 'Costa Rica'
            },
            {
                'code': 'CI',
                'name': 'Cote d\'Ivoire'
            },
            {
                'code': 'HR',
                'name': 'Croatia'
            },
            {
                'code': 'CU',
                'name': 'Cuba'
            },
            {
                'code': 'CY',
                'name': 'Cyprus'
            },
            {
                'code': 'CZ',
                'name': 'Czechia'
            },
            {
                'code': 'DK',
                'name': 'Denmark'
            },
            {
                'code': 'DJ',
                'name': 'Djibouti'
            },
            {
                'code': 'DO',
                'name': 'Dominican Republic'
            },
            {
                'code': 'EC',
                'name': 'Ecuador'
            },
            {
                'code': 'EG',
                'name': 'Egypt'
            },
            {
                'code': 'SV',
                'name': 'El Salvador'
            },
            {
                'code': 'GQ',
                'name': 'Equatorial Guinea'
            },
            {
                'code': 'ER',
                'name': 'Eritrea'
            },
            {
                'code': 'EE',
                'name': 'Estonia'
            },
            {
                'code': 'ET',
                'name': 'Ethiopia'
            },
            {
                'code': 'FJ',
                'name': 'Fiji'
            },
            {
                'code': 'FI',
                'name': 'Finland'
            },
            {
                'code': 'FR',
                'name': 'France'
            },
            {
                'code': 'GA',
                'name': 'Gabon'
            },
            {
                'code': 'GM',
                'name': 'Gambia'
            },
            {
                'code': 'GE',
                'name': 'Georgia'
            },
            {
                'code': 'DE',
                'name': 'Germany'
            },
            {
                'code': 'GH',
                'name': 'Ghana'
            },
            {
                'code': 'GR',
                'name': 'Greece'
            },
            {
                'code': 'GT',
                'name': 'Guatemala'
            },
            {
                'code': 'GN',
                'name': 'Guinea'
            },
            {
                'code': 'GW',
                'name': 'Guinea-Bissau'
            },
            {
                'code': 'GY',
                'name': 'Guyana'
            },
            {
                'code': 'HT',
                'name': 'Haiti'
            },
            {
                'code': 'HN',
                'name': 'Honduras'
            },
            {
                'code': 'HK',
                'name': 'Hong Kong'
            },
            {
                'code': 'HU',
                'name': 'Hungary'
            },
            {
                'code': 'IS',
                'name': 'Iceland'
            },
            {
                'code': 'IN',
                'name': 'India'
            },
            {
                'code': 'ID',
                'name': 'Indonesia'
            },
            {
                'code': 'IR',
                'name': 'Iran'
            },
            {
                'code': 'IQ',
                'name': 'Iraq'
            },
            {
                'code': 'IE',
                'name': 'Ireland'
            },
            {
                'code': 'IL',
                'name': 'Israel'
            },
            {
                'code': 'IT',
                'name': 'Italy'
            },
            {
                'code': 'JM',
                'name': 'Jamaica'
            },
            {
                'code': 'JP',
                'name': 'Japan'
            },
            {
                'code': 'JO',
                'name': 'Jordan'
            },
            {
                'code': 'KZ',
                'name': 'Kazakhstan'
            },
            {
                'code': 'KE',
                'name': 'Kenya'
            },
            {
                'code': 'KP',
                'name': 'N. Korea'
            },
            {
                'code': 'KR',
                'name': 'S. Korea'
            },
            {
                'code': 'KW',
                'name': 'Kuwait'
            },
            {
                'code': 'KG',
                'name': 'Kyrgyzstan'
            },
            {
                'code': 'LA',
                'name': 'Laos'
            },
            {
                'code': 'LV',
                'name': 'Latvia'
            },
            {
                'code': 'LB',
                'name': 'Lebanon'
            },
            {
                'code': 'LS',
                'name': 'Lesotho'
            },
            {
                'code': 'LR',
                'name': 'Liberia'
            },
            {
                'code': 'LY',
                'name': 'Libya'
            },
            {
                'code': 'LT',
                'name': 'Lithuania'
            },
            {
                'code': 'LU',
                'name': 'Luxembourg'
            },
            {
                'code': 'MK',
                'name': 'North Macedonia'
            },
            {
                'code': 'MG',
                'name': 'Madagascar'
            },
            {
                'code': 'MW',
                'name': 'Malawi'
            },
            {
                'code': 'MY',
                'name': 'Malaysia'
            },
            {
                'code': 'ML',
                'name': 'Mali'
            },
            {
                'code': 'MR',
                'name': 'Mauritania'
            },
            {
                'code': 'MU',
                'name': 'Mauritius'
            },
            {
                'code': 'MX',
                'name': 'Mexico'
            },
            {
                'code': 'MD',
                'name': 'Moldova'
            },
            {
                'code': 'MN',
                'name': 'Mongolia'
            },
            {
                'code': 'ME',
                'name': 'Montenegro'
            },
            {
                'code': 'MA',
                'name': 'Morocco'
            },
            {
                'code': 'MZ',
                'name': 'Mozambique'
            },
            {
                'code': 'MM',
                'name': 'Myanmar'
            },
            {
                'code': 'NA',
                'name': 'Namibia'
            },
            {
                'code': 'NP',
                'name': 'Nepal'
            },
            {
                'code': 'NL',
                'name': 'Netherlands'
            },
            {
                'code': 'NZ',
                'name': 'New Zealand'
            },
            {
                'code': 'NI',
                'name': 'Nicaragua'
            },
            {
                'code': 'NE',
                'name': 'Niger'
            },
            {
                'code': 'NG',
                'name': 'Nigeria'
            },
            {
                'code': 'NO',
                'name': 'Norway'
            },
            {
                'code': 'OM',
                'name': 'Oman'
            },
            {
                'code': 'PK',
                'name': 'Pakistan'
            },
            {
                'code': 'PA',
                'name': 'Panama'
            },
            {
                'code': 'PG',
                'name': 'Papua New Guinea'
            },
            {
                'code': 'PY',
                'name': 'Paraguay'
            },
            {
                'code': 'PE',
                'name': 'Peru'
            },
            {
                'code': 'PH',
                'name': 'Philippines'
            },
            {
                'code': 'PL',
                'name': 'Poland'
            },
            {
                'code': 'PT',
                'name': 'Portugal'
            },
            {
                'code': 'PR',
                'name': 'Puerto Rico'
            },
            {
                'code': 'QA',
                'name': 'Qatar'
            },
            {
                'code': 'RO',
                'name': 'Romania'
            },
            {
                'code': 'RU',
                'name': 'Russia'
            },
            {
                'code': 'RW',
                'name': 'Rwanda'
            },
            {
                'code': 'SA',
                'name': 'Saudi Arabia'
            },
            {
                'code': 'SN',
                'name': 'Senegal'
            },
            {
                'code': 'RS',
                'name': 'Serbia'
            },
            {
                'code': 'SL',
                'name': 'Sierra Leone'
            },
            {
                'code': 'SG',
                'name': 'Singapore'
            },
            {
                'code': 'SK',
                'name': 'Slovakia'
            },
            {
                'code': 'SI',
                'name': 'Slovenia'
            },
            {
                'code': 'SB',
                'name': 'Solomon Islands'
            },
            {
                'code': 'SO',
                'name': 'Somalia'
            },
            {
                'code': 'ZA',
                'name': 'South Africa'
            },
            {
                'code': 'ES',
                'name': 'Spain'
            },
            {
                'code': 'LK',
                'name': 'Sri Lanka'
            },
            {
                'code': 'SD',
                'name': 'Sudan'
            },
            {
                'code': 'SR',
                'name': 'Suriname'
            },
            {
                'code': 'SZ',
                'name': 'Swaziland'
            },
            {
                'code': 'SE',
                'name': 'Sweden'
            },
            {
                'code': 'CH',
                'name': 'Switzerland'
            },
            {
                'code': 'SY',
                'name': 'Syria'
            },
            {
                'code': 'TW',
                'name': 'Taiwan'
            },
            {
                'code': 'TJ',
                'name': 'Tajikistan'
            },
            {
                'code': 'TZ',
                'name': 'Tanzania'
            },
            {
                'code': 'TH',
                'name': 'Thailand'
            },
            {
                'code': 'TG',
                'name': 'Togo'
            },
            {
                'code': 'TT',
                'name': 'Trinidad and Tobago'
            },
            {
                'code': 'TN',
                'name': 'Tunisia'
            },
            {
                'code': 'TR',
                'name': 'Turkey'
            },
            {
                'code': 'TM',
                'name': 'Turkmenistan'
            },
            {
                'code': 'UG',
                'name': 'Uganda'
            },
            {
                'code': 'UA',
                'name': 'Ukraine'
            },
            {
                'code': 'AE',
                'name': 'UAE'
            },
            {
                'code': 'GB',
                'name': 'UK'
            },
            {
                'code': 'US',
                'name': 'US'
            },
            {
                'code': 'UY',
                'name': 'Uruguay'
            },
            {
                'code': 'UZ',
                'name': 'Uzbekistan'
            },
            {
                'code': 'VE',
                'name': 'Venezuela'
            },
            {
                'code': 'PS',
                'name': 'West Bank and Gaza'
            },
            {
                'code': 'VN',
                'name': 'Vietnam'
            },
            {
                'code': 'YE',
                'name': 'Yemen, Rep.'
            },
            {
                'code': 'ZM',
                'name': 'Zambia'
            },
            {
                'code': 'ZW',
                'name': 'Zimbabwe'
            }
        ];

        mapData.forEach(element => {
            // if (dict[element.name] == undefined) {
            //     console.log(element.name)
            // }
            if (dict[element.name] != undefined) {
                element.value = dict[element.name][0] + dict[element.name][1] + dict[element.name][2]
                if (element.value < 10)
                    element.color = '#FFEDA0'
                else if (element.value < 20)
                    element.color = '#FED976'
                else if (element.value < 50)
                    element.color = '#FEB24C'
                else if (element.value < 100)
                    element.color = '#FD8D3C'
                else if (element.value < 200)
                    element.color = '#FC682A'
                else if (element.value < 500)
                    element.color = '#E05C26'
                else if (element.value < 1000)
                    element.color = '#E83F00'
                else
                    element.color = '#F30000'
            }
        });

        var max = -Infinity;
        var min = Infinity;
        mapData.forEach(function (itemOpt) {
            if (itemOpt.value > max) {
                max = itemOpt.value;
            }
            if (itemOpt.value < min) {
                min = itemOpt.value;
            }
        });
        var chart = echarts.init(document.getElementById('main'));
        option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') +
                        '.' + value[1];
                    if (dict[params.name] != undefined)
                        return params.name + '<br>Confirmed: ' + dict[params.name][0] + '<br>Infected: ' + (dict[params.name][0] - dict[params.name][1] - dict[params.name][2]) + '<br>Deaths: ' + dict[params.name][1] + '<br>Recovered: ' + dict[params.name][2];
                }
            },
            visualMap: {
                show: false,
                min: 0,
                max: max,
                inRange: {
                    symbolSize: [6, 60]
                }
            },
            geo: {
                name: 'COVID19',
                type: 'map',
                map: 'world',
                roam: true,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#e1e1e1',
                        borderColor: '#fff'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: [{
                type: 'scatter',
                coordinateSystem: 'geo',
                data: mapData.map(function (itemOpt) {
                    return {
                        name: itemOpt.name,
                        value: [
                            latlong[itemOpt.code].longitude,
                            latlong[itemOpt.code].latitude,
                            itemOpt.value
                        ],
                        label: {
                            emphasis: {
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: itemOpt.color
                            }
                        }
                    };
                })
            }]
        };
        chart.setOption(option);
    });
    ajax4();
}

function ajax2() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "f87d8b7daemsh99560a3534f1f1ap14d466jsn01568a97fbdf"
        }
    }

    $.ajax(settings).done(function (data) {
        data = $.parseJSON(data);
        data.total_cases = data.total_cases.replace(',', '')
        data.total_deaths = data.total_deaths.replace(',', '')
        data.total_recovered = data.total_recovered.replace(',', '')
        document.getElementById('confirmedN').innerHTML = data.total_cases + ' (+' + data.new_cases.replace(',', '') + ')'
        document.getElementById('infectedN').innerHTML = parseInt(data.total_cases) - parseInt(data.total_deaths) - parseInt(data.total_recovered)
        document.getElementById('deathsN').innerHTML = data.total_deaths + ' (+' + data.new_deaths.replace(',', '') + ')'
        document.getElementById('recoveredN').innerHTML = data.total_recovered
        total[0] = parseInt(data.total_cases)
        total[1] = parseInt(data.total_cases) - parseInt(data.total_deaths) - parseInt(data.total_recovered)
        total[2] = parseInt(data.total_deaths)
        total[3] = parseInt(data.total_recovered)
        ajax3()
    });

}
ajax2()