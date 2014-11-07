var currentSelection = "AAPL";

var stocksApp = angular.module('stocksApp', ['ngRoute']);


stocksApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/',  {
        controller: 'MainView', 
        templateUrl: 'template1.html'
    })
    
    .when('/full-profile',{
        controller: 'FullProfile', 
        templateUrl: 'template2.html' 
    })
    .otherwise({redirectTo:'/' });

}]);


stocksApp.controller('MainView', ["$scope", function ($scope) {
    CheckStockValues(currentSelection,1);
}]);

stocksApp.controller('FullProfile', ["$scope", function ($scope) {
    CheckStockValues(currentSelection,2);
}]);

var Markit = {};

Markit.QuoteService = function(sSymbol, fCallback) {
    this.symbol = sSymbol;
    this.fCallback = fCallback;
    this.DATA_SRC = "http://dev.markitondemand.com/Api/v2/Quote/jsonp";
    this.makeRequest();
};

Markit.QuoteService.prototype.handleSuccess = function(jsonResult) {
    this.fCallback(jsonResult);
};

Markit.QuoteService.prototype.handleError = function(jsonResult) {
    console.error(jsonResult);
};

Markit.QuoteService.prototype.makeRequest = function() {
    //Abort any open requests
    if (this.xhr) { this.xhr.abort(); }
    //Start a new request
    this.xhr = $.ajax({
        data: { symbol: this.symbol },
        url: this.DATA_SRC,
        dataType: "jsonp",
        success: this.handleSuccess,
        error: this.handleError,
        context: this
    });
};


function CheckStockValues(stockSymbol, printType){

    new Markit.QuoteService(stockSymbol, function(jsonResult) {

        if (!jsonResult || jsonResult.Message){
            console.error("Error: ", jsonResult.Message);
            return;
        }

        //console.log(jsonResult);
        
        if (printType==1){
            var blankTable= $("<p class='companay-info'></p>\
                        <button type='button' class='btn btn-default btn-sx refresh-current'>\
                            <span class='glyphicon glyphicon-flash'></span> Refresh\
                        </button>\
                        <button type='button' class='btn btn-default btn-sx view-full-profile'>\
                            <span class='glyphicon glyphicon-eye-open'></span> Full Profile\
                        </button>\
                        <table>\
                            <th>Last Price</th>\
                            <th>Change</th>\
                            <th>Change Percent</th>\
                            <th>Change Percent YTD</th>\
                            <th>Last Traded</th>\
                            <tr>\
                                <td class='last-price'></td>\
                                <td class='change-value'></td>\
                                <td class='change-percent'></td>\
                                <td class='change-ytd'></td>\
                                <td class='last-traded'></td>\
                            </tr>\
                        </table>").hide();
            
            $(".results").empty().append(blankTable);
            $(blankTable).fadeIn(500);
            $(".companay-info").empty().append(jsonResult.Name+" ("+jsonResult.Symbol+")");
            $(".last-price").empty().append("$"+jsonResult.LastPrice.toFixed(2));
            $(".change-value").empty().append(jsonResult.Change.toFixed(2));
            $(".change-percent").empty().append(jsonResult.ChangePercent.toFixed(2)+"%");
            $(".change-ytd").empty().append(jsonResult.ChangePercentYTD.toFixed(2)+"%");
            $(".last-traded").empty().append(jsonResult.Timestamp);
        }
        
        if (printType==2){
           
            
            var newTable = $("<h1 class='companay-info'></h1>\
                        <button type='button' class='btn btn-default btn-sx refresh-current-full'>\
                            <span class='glyphicon glyphicon-flash'></span> Refresh\
                        </button>\
                        <table>\
                            <th>Last Price</th>\
                            <th>Change</th>\
                            <th>Change Percent</th>\
                            <th>Change Percent YTD</th>\
                            <th>Last Traded</th>\
                            <tr>\
                                <td class='last-price'></td>\
                                <td class='change-value'></td>\
                                <td class='change-percent'></td>\
                                <td class='change-ytd'></td>\
                                <td class='last-traded'></td>\
                            </tr>\
                        </table>\
                        <table>\
                            <th>High price</th>\
                            <th>Low price</th>\
                            <th>Openning price</th>\
                            <th>Market cap</th>\
                            <th>Volume</th>\
                            <tr>\
                                <td class='high-price'></td>\
                                <td class='low-price'></td>\
                                <td class='openning-price'></td>\
                                <td class='market-cap'></td>\
                                <td class='volume'></td>\
                            </tr>\
                        </table>\
            ").hide();
            $(".company-profile").empty().append(newTable);
            $(newTable).fadeIn(500);
            
            $(".companay-info").empty().append(jsonResult.Name+" ("+jsonResult.Symbol+")");
            $(".last-price").empty().append("$"+jsonResult.LastPrice.toFixed(2));
            $(".change-value").empty().append(jsonResult.Change.toFixed(2));
            $(".change-percent").empty().append(jsonResult.ChangePercent.toFixed(2)+"%");
            $(".change-ytd").empty().append(jsonResult.ChangePercentYTD.toFixed(2)+"%");
            $(".last-traded").empty().append(jsonResult.Timestamp);
            $(".high-price").empty().append(jsonResult.High.toFixed(2));
            $(".low-price").empty().append(jsonResult.Low.toFixed(2));
            $(".openning-price").empty().append(jsonResult.Open.toFixed(2));
            $(".market-cap").empty().append(jsonResult.MarketCap);
            $(".volume").empty().append(jsonResult.Volume);
        }
    });   

}

$(document).on("click",".new-search",function(){
    searchTerm = $(".new-search-input").val();
    currentSelection = searchTerm;
    CheckStockValues(searchTerm,1);
});

$(document).on("click",".refresh-current",function(){
    CheckStockValues(currentSelection,1);
});

$(document).on("click",".refresh-current-full",function(){
    CheckStockValues(currentSelection,2);
});

$(document).on("click",".view-full-profile",function(){
    window.location = "index.html#/full-profile";
});

$(document).on("click",".tag-link",function(){

    currentSelection = $(this).attr("data-tag");
    CheckStockValues(currentSelection,1);
});