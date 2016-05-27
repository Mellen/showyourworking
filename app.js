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
			    this.firstNumberParts = $scope.firstNumber.split('');
			    this.secondNumberParts = $scope.secondNumber.split('');
			    
			    this.isMultiplying = true;

			    this.steps = [];

			    this.n1predot = calculatePreDot($scope.firstNumber, $scope.secondNumber);
			    this.n1postdot = calculatePostDot($scope.firstNumber, $scope.secondNumber);
			    this.n2predot = calculatePreDot($scope.secondNumber, $scope.firstNumber);
			    this.n2postdot = calculatePostDot($scope.secondNumber, $scope.firstNumber);

			    if(this.n1predot > this.n2predot)
			    {
				this.n1predot += 1;
			    }

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

				console.log(span);
				
				return span;
			    }

			    function calculatePreDot(n1, n2)
			    {
				var span = 0;

				var n1pd = 0;
				var n2pd = 0;

				if(n1.indexOf('.') > -1)
				{
				    n1pd = n1.split('.')[0].length;
				}
				else
				{
				    n1pd = n1.length;
				}

				if(n2.indexOf('.') > -1)
				{
				    n2pd = n2.split('.')[0].length;
				}
				else
				{
				    n2pd = n2.length;
				}

				if(n1pd < n2pd)
				{
				    span = n2pd - n1pd;
				}

				console.log(span);
				
				return span;
			    }

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

