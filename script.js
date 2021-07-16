$(document).ready(function(){
    // ON LOAD
    DisplaySearchHistory()
        //Call default city where the page is displayed 
        DifaultCity();
    // Weather API
        function DifaultCity(){
            var url = "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=0946b5eb988b3caf2e24954f8caf2636"
                   $.get(url,function(data,status){
                    console.log(data)
                    DiplayDataOnPage(data)
                    FivedaysApiCall(data.name)
            })
        }
          //Function to display default city 
           function DiplayDataOnPage(data){
            var icon = data.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
            $('#icon-w').attr('src',iconUrl)
          
            var currentDate = new Date(data.dt * 1000).toISOString(); //https://stackoverflow.com/questions/56070796/show-day-name-instead-of-number-from-open-weather-api-response
            //Convert date 
            var display =  data.name + " (" + moment(currentDate).format("MM/D/YYYY") + ")"
            $('#cityName').text(display)
            //Convertion to °F
            var tempFar = parseInt((data.main.temp - 273.15)* 9/5 + 32);
    
            // Display temperature  
            $('#temperatureSet').text(tempFar+ " °F")
            // Display humidity 
           $('#humiditySet').text(data.main.humidity + "%" )
           // Display  wind 
           $('#windSet').text(data.wind.speed)
    
          // 2nd ajax call to get the UV index
                // http://api.openweathermap.org/data/2.5/uvi/forecast?appid=0946b5eb988b3caf2e24954f8caf2636&lat={lat}&lon={lon}&cnt={cnt}
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                $.ajax({
                  method: "GET",
                  url:
                    "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=0946b5eb988b3caf2e24954f8caf2636&lat=" +
                    lat +
                    "&lon=" +
                    lon
                }).then(function(uvdata) {
                  console.log(uvdata);
                  $("#uvSet").text(uvdata[0].value);
                });
           }
    
           // on click on submit=> event listener on search button
           $("#search-button").click(function(event){
             event.preventDefault()
    
              //Check if value is valid => size !=0
              const city = $("#search-input")
              .val()
              .trim();
             console.log(city)
             
        // API call: GET POST PUT DELETE
             var ApiUrl ="https://api.openweathermap.org/data/2.5/weather?q=" + city +"&APPID=0946b5eb988b3caf2e24954f8caf2636";
             $.ajax({
              method: "GET",
              url: ApiUrl
            }).then(function(response) {
        //Save data in the local storage
              localStorage.setItem(city, JSON.stringify(response));
        // Add city in the search list
              var li = $(
                `<button type='button' class='list-group-item list-group-item-action' id='${city}'>${city}</li>`
              );
          // Append the list item to the list by uding the id search-history
              li.appendTo("#search-history");
        
          //Console.log(response);
              DiplayDataOnPage(response);
        
         //API CALL TO GET WEATHER DATA FOR 5 DAYS
              FivedaysApiCall(city);
            });
       
           })
    
           function FivedaysApiCall(city) {
            //API CALL 
            var ApiUrl =
              "https://api.openweathermap.org/data/2.5/forecast?q=" +
              city +
              "&APPID=0946b5eb988b3caf2e24954f8caf2636";
            $.ajax({
              method: "GET",
              url: ApiUrl
            }).then(function(data) {
              console.log(data);
              $("#forecast").empty();
              var forecastArray = data.list;
        
              forecastArray.forEach(function(forecast, index) {
                //Get the date and time out of dt_txt
                var forecastDateTxt = forecast.dt_txt;
        
                //Card body 
                var forecastDate = forecastDateTxt.split(" ")[0];
                var forecastTime = forecastDateTxt.split(" ")[1];
                // console.log(forecastDate);
                // console.log(forecastTime);
        
                // since the api return forecast for every 3hours, return only a forecast for a spcecific hour =>
                if (forecastTime === "00:00:00") {
                  //Build a card
                  //const card = $("<card class=' mr-2 bg-primary text-white small' style='width: 9rem;'>");
                  var card;
                  if (index === forecastArray.length - 1) {
                    card = $(
                      "<div class='card bg-primary text-white  col col-md-3 col-lg-2 col-sm-3 col-xs-12' style=''>"
                    );
                  } else {
                    card = $(
                      "<div class='card mr-4 mr-2 bg-primary text-white col col-md-3 col-lg-2 col-sm-3 col-xs-12' style=''>"
                    );
                  }
                  const cardBody = $("<div class='card-body my-1'>");
                  const h5 = $("<h6 class='card-title'>")
                    .text(moment(forecastDate.trim()).format("MM/D/YYYY"))
                    .appendTo(cardBody);
        
                  var imgUrl =
                    "https://openweathermap.org/img/wn/" +
                    forecast.weather[0].icon +
                    ".png";
                  const img = $("<img>")
                    .attr("src", imgUrl)
                    .attr("alt", "Weather Forecast icon")
                    .appendTo(cardBody);
        
                  var lineBreak = $("<br>").appendTo(cardBody);
                  var tempFar = parseInt((forecast.main.temp - 273.15)* 9/5 + 32);
                  var tempSpan = $("<span>")
                    .text(`Temp: ${tempFar} °F`)
                    .appendTo(cardBody);
        
                  var lineBreak = $("<br>").appendTo(cardBody);
        
                  var humiditySpan = $("<span>")
                    .text(`Humidity: ${forecast.main.humidity} %`)
                    .appendTo(cardBody);
        
                  //Append the card body to the card
                  cardBody.appendTo(card);
        
                  //Append the card to the row forecast
                  $("#forecast").append(card);
                }
              });
            });
          }
  
    //on click submit=> event listneron search button
    
    function DisplaySearchHistory() {
      var cities = Object.keys(localStorage);
      console.log(cities);
      cities.forEach(function(city) {
        var li = $(
          `<button type='button' class='list-group-item list-group-item-action' id='${city}'>${city}</li>`
        );
        // Append the list item to the list by undoing the id search-history
        li.appendTo("#search-history");
      });
    }
     
            
    })