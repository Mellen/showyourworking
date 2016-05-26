(function()
 {
     var app = angular.module('showyourworking', []);

     app.controller('InputController', ['$scope', '$compile', function($scope, $compile)
		    {
			$scope.firstNumber = ''
			$scope.secondNumber = '';
			$scope.submit = function()
			{
			    var el = $compile('<working-area></working-area>')($scope);
			    angular.element(document.body).append(el);
			};
		    }]
		   );


     app.directive('inputArea', function()
		   {
		       return {
			   restrict: 'E',
			   templateUrl: 'input-area.html'
		       };
		   });

     app.controller('StepController',
		    [
			'$scope',
			function($scope)
			{
			    this.firstNumberParts = $scope.firstNumber.split('');
			    this.secondNumberParts = $scope.secondNumber.split('');
			    
			    this.isMultiplying = true;

			    this.steps = [];

			    this.step = function()
			    {
				
			    };
			    
			}
		    ]
		   );

     app.directive('workingArea', function()
		   {
		       return {
			   restrict: 'E',
			   templateUrl: 'working-area.html'
		       };
		   });
 })();

