var app=angular.module("Analyze",[]);
app.controller("analyzectrl",function ($scope,$http) {
    $scope.analyzeg = function () {
        var gen=$scope.text;
        var words = $http.get("https://api.uclassify.com/v1/uclassify/genderanalyzer_v5/Classify?readkey=OcM9GwGXd54G&text=" + gen)
        words.success(function (data) {
            console.log(data);
            $scope.analyzelang={"female":data.female*100,"male":data.male*100};
            
        });
    }
});

app.controller("languagectrl",function ($scope,$http) {
    $scope.language1 = function () {
        var gen=$scope.text;
        var tar=$scope.lang2;
       var words1 = $http.get("https:language.uclassify.com/translate/v1/?key=zUp0kQ7FswHV&source=sv&target=en&t="+gen);
           //"https://www.googleapis.com/language/translate/v2?key=AIzaSyBvJg27tZ6NjKyXP87qzx0yrLFjReg1JaU&source=en&target="+tar+"&q=" + gen)
        
        words1.success(function (data1) {
            console.log(data1);
            $scope.langlang={"translatedText":data1.data.translations["0"].translatedText};
            });
    }
});
