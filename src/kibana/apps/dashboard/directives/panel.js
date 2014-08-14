define(function (require) {
  var app = require('modules').get('app/dashboard');
  var _ = require('lodash');

  require('apps/visualize/directives/visualize');

  app.directive('dashboardPanel', function (savedVisualizations, Notifier) {
    var notify = new Notifier();
    return {
      restrict: 'E',
      template: require('text!apps/dashboard/partials/panel.html'),
      requires: '^dashboardGrid',
      link: function ($scope, $el) {
        // using $scope inheritance, panels are available in AppState
        var $state = $scope.state;

        // receives panel object from the dashboard grid directive
        $scope.$watch('visId', function (visId) {
          delete $scope.vis;
          if (!$scope.panel.visId) return;

          savedVisualizations.get($scope.panel.visId)
          .then(function (vis) {
            $scope.vis = vis;
            // .destroy() called by the visualize directive
          })
          .catch(function (e) {
            $scope.vis = {
              error: e
            };
            console.log(e);
          });
        });

        $scope.remove = function () {
          _.pull($state.panels, $scope.panel);
        };
      }
    };
  });
});