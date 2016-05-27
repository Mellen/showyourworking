(function()
 {
     var app = angular.module('showyourworking', []);

     app.controller('InputController', ['$scope', '$compile', function($scope, $compile)
		    {
			$scope.firstNumber = ''
			$scope.secondNumber = '';
			$scope.inputDone = false;
			$scope.submit = function()
			{
			    var el = $compile('<working-area></working-area>')($scope);
			    angular.element(document.body).append(el);
			    $scope.inputDone = true;
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
			    $scope.firstNumber = $scope.firstNumber.trim();
			    $scope.secondNumber = $scope.secondNumber.trim();
			    
			    this.firstNumberParts = $scope.firstNumber.split('');
			    this.secondNumberParts = $scope.secondNumber.split('');
			    
			    this.isMultiplying = true;

			    this.steps = [];

			    this.n1postdot = calculatePostDot($scope.firstNumber, $scope.secondNumber);
			    this.n2postdot = calculatePostDot($scope.secondNumber, $scope.firstNumber);

			    this.answerCharCount = $scope.firstNumber.match(/\d/g).length + $scope.secondNumber.match(/\d/g).length;

			    if($scope.firstNumber.indexOf('.') > -1 || $scope.secondNumber.indexOf('.') > -1)
			    {
				this.answerCharCount++;
			    }

			    if($scope.firstNumber.indexOf('.') > -1 && $scope.secondNumber.indexOf('.') === -1)
			    {
				this.n2postdot++;
			    }

			    if($scope.firstNumber.indexOf('.') === -1 && $scope.secondNumber.indexOf('.') > -1)
			    {
				this.n1postdot++;
			    }

			    if(($scope.firstNumber[0] === '-' && $scope.secondNumber[0] !== '-') && ($scope.firstNumber[0] !== '-' && $scope.secondNumber[0] === '-'))
			    {
				this.answerCharCount++;
				this.isNegative = true;
			    }

			    this.generateRange = function(size)
			    {
				return new Array(size);
			    };
			    
			    this.underlineRange = function()
			    {
				return new Array(this.answerCharCount + 2);
			    };
			    
			    function calculatePostDot(n1, n2)
			    {
				var span = 0;

				var n1pd = 0;
				var n2pd = 0;

				if(n1.indexOf('.') > -1)
				{
				    n1pd = n1.split('.')[1].length;
				}

				if(n2.indexOf('.') > -1)
				{
				    n2pd = n2.split('.')[1].length;
				}

				if(n1pd < n2pd)
				{
				    span = n2pd - n1pd;
				}
			
				return span;
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

