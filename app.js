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
			    this.additionSteps = [];

			    this.n1postdot = calculatePostDot($scope.firstNumber, $scope.secondNumber);
			    this.n2postdot = calculatePostDot($scope.secondNumber, $scope.firstNumber);

			    this.answerHasDP = this.firstNumberParts.indexOf('.') > -1 || this.secondNumberParts.indexOf('.') > -1;
			    this.answerDPCount = 0;

			    if(this.answerHasDP)
			    {
				if(this.firstNumberParts.indexOf('.') > -1)
				{
				    this.answerDPCount = $scope.firstNumber.split('.')[1].length;
				}

				if(this.secondNumberParts.indexOf('.') > -1)
				{
				    this.answerDPCount += $scope.secondNumber.split('.')[1].length;
				}
			    }

			    this.answerCharCount = $scope.firstNumber.match(/\d/g).length + $scope.secondNumber.match(/\d/g).length;

			    this.extras = this.n1postdot > this.n2postdot ? this.n1postdot : this.n2postdot;

			    if(this.answerHasDP &&  (this.firstNumberParts.indexOf('.') === -1 || this.secondNumberParts.indexOf('.') === -1))
			    {
				this.extras++;
			    }

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

			    this.isNegative = false;
			    
			    if(($scope.firstNumber[0] === '-' && $scope.secondNumber[0] !== '-') || ($scope.firstNumber[0] !== '-' && $scope.secondNumber[0] === '-'))
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

			    this.rowCount = function()
			    {
				var c2 = $scope.secondNumber.match(/\d/g).length;
				return new Array(c2);
			    };

			    this.refresh = function()
			    {
				window.location.reload();
			    };

			    this.nextStep = function()
			    {
				if(this.isMultiplying)
				{
				    this.nextMultiStep();
				}

				if(!this.isMultiplying)
				{
				    this.nextAddStep();
				}
			    }

			    this.nextAddStep = function()
			    {
				var step = {result:0, carry:0};

				if(this.answerHasDP && this.additionSteps.length === this.answerDPCount)
				{
				    step.result = '.';
				    step.carry = this.additionSteps[0].carry;
				    this.additionSteps[0].carry = 0;
				}
				else if(this.isNegative && this.additionSteps.length === (this.answerCharCount -1))
				{
				    step.result = '-';
				}
				else
				{
				    var sum = 0;
				    for(var ri = 0; ri < this.steps.length; ri++)
				    {
					var row = this.steps[ri];
					var index = (row.length - this.additionSteps.length) - 1;
					if(index < 0 || row[index].result === '-')
					{
					    continue;
					}
					sum += row[index].result;
				    }
				    var carry = 0;
				    if(this.additionSteps.length > 0)
				    {
					carry = this.additionSteps[0].carry;
				    }
				    
				    step.result = (sum + carry)%10;
				    step.carry = Math.floor((sum + carry)/10);
				}
				this.additionSteps.unshift(step);
			    };
			    
			    this.nextMultiStep = function()
			    {
				if(this.steps.length === 0)
				{
				    var newRow = [];
				    var fnli = this.firstNumberParts.length - 1;
				    var snli = this.secondNumberParts.length - 1;
				    var fullResult = parseInt(this.firstNumberParts[fnli]) * parseInt(this.secondNumberParts[snli]);
				    var carry = Math.floor(fullResult/10);
				    var result = fullResult % 10;
				    var step = {firstPartIndex:fnli, secondPartIndex:snli, result: result, carry: carry};
				    newRow.push(step);
				    if(fnli === 0 || (fnli === 1 && this.isNegative))
				    {
					if(newRow[0].carry > 0)
					{
					    var carryStep = {firstPartIndex:0, secondPartIndex:snli, result: newRow[0].carry, carry:0};
					    newRow.unshift(carryStep);
					}
					if(this.isNegative)
					{
					    var negStep = {firstPartIndex:0, secondPartIndex:snli, result:'-', carry:0};
					    newRow.unshift(negStep);
					}
				    }

				    if(this.answerHasDP && this.answerDPCount === 1)
				    {
					var dpStep = {firstPartIndex:fnli, secondPartIndex:snli, result:'.', carry:carry};
					newRow.unshift(dpStep);
					newRow[1].carry = 0;
				    }


				    this.steps.push(newRow);
				}
				else
				{
				    var rowIndex = this.steps.length -1;
				    var row = this.steps[rowIndex];

				    var fni = row[0].firstPartIndex - 1;
				    if(this.firstNumberParts[fni] === '.' || this.firstNumberParts[fni] === '-')
				    {
					fni--;
				    }
				    var sni = row[0].secondPartIndex;
				    var insertRow = false;
				    
				    if(fni < 0)
				    {
					if(sni !== 0)
					{
					    fni = this.firstNumberParts.length - 1;
					    sni--;

					    if(this.secondNumberParts[sni] === '.')
					    {
						sni--;
					    }
					    
					    if(this.secondNumberParts[sni] === '-')
					    {
						this.isMultiplying = false;
						return;
					    }

					    row = [];
					    var zeroCount = this.steps.length;
					    for(var i = 0; i < zeroCount; i++)
					    {
						row.unshift({firstPartIndex:fni , secondPartIndex: sni, result:0, carry:0});
						if(this.answerHasDP && row.length === this.answerDPCount)
						{
						    var dpStep = {firstPartIndex:fni, secondPartIndex:sni, result:'.', carry:0};
						    row.unshift(dpStep);
						}
					    }
					    
					    insertRow = true;
					}
					else
					{
					    this.isMultiplying = false;
					    return;
					}
				    }

				    var fullResult = (parseInt(this.firstNumberParts[fni]) * parseInt(this.secondNumberParts[sni])) + row[0].carry;
				    var carry = Math.floor(fullResult/10);
				    var result = fullResult % 10;
				    var step = {firstPartIndex:fni, secondPartIndex:sni, result: result, carry: carry};
				    row.unshift(step);

				    if(this.answerHasDP && row.length === this.answerDPCount)
				    {
					var dpStep = {firstPartIndex:fni, secondPartIndex:sni, result:'.', carry:carry};
					row.unshift(dpStep);
					row[1].carry = 0;
				    }
				    
 				    if(fni === 0 || (fni === 1 && this.firstNumberParts[0] === '-'))
				    {
					if(row[0].carry > 0)
					{
					    var carryStep = {firstPartIndex:0, secondPartIndex:sni, result: row[0].carry, carry:0};
					    row.unshift(carryStep);
					}
					var addDP = (this.answerHasDP && row.length === this.answerDPCount);
					while(row.length < this.answerDPCount)
					{
					    var zeroStep = {firstPartIndex:0, secondPartIndex:sni, result:0, carry:0};
					    row.unshift(zeroStep);
					    var addDP = true;
					}
					if(addDP)
					{
					    var dpStep = {firstPartIndex:fni, secondPartIndex:sni, result:'.', carry:0};
					    row.unshift(dpStep);
					}
					if(row[0].result === '.')
					{
					    var zeroStep = {firstPartIndex:0, secondPartIndex:sni, result:0, carry:0};
					    row.unshift(zeroStep);					    
					}
					
					if(this.isNegative)
					{
					    var negStep = {firstPartIndex:0, secondPartIndex:sni, result:'-', carry:0};
					    row.unshift(negStep);
					}
				    }
				    
				    if(insertRow)
				    {
					this.steps.push(row);
				    }
				}
			    };

			    this.previousStep = function()
			    {
				if(!this.isMultiplying)
				{
				    this.additionSteps.shift();
				    if(this.additionSteps.length === 0)
				    {
					this.isMultiplying = true;
				    }
				}
				else
				{
				    var ri = this.steps.length -1;
				    
				    this.steps[ri].shift();
				    
				    if(this.steps[ri].length === 0)
				    {
					this.steps.pop();
				    }
				}
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

