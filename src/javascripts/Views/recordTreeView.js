var recordTreeViewController = function($scope, $element, $timeout, stylesheetService, treeService, recordTreeService, nodeSelectionService, treeColumnService) {
    // link view to scope
    let data = $scope.$parent.tab.data;
    data.scope = $scope;

    // helper variables
    let overrides = [];

    // inherited functions
    treeService.buildFunctions($scope, $element);
    recordTreeService.buildFunctions($scope);
    nodeSelectionService.buildFunctions($scope);
    treeColumnService.buildFunctions($scope, '.record-tree-view', false);

    // helper functions
    let getRecordFileName = function(record) {
        let fileName = '';
        xelib.WithHandle(xelib.GetElementFile(record), function(file) {
            fileName = xelib.DisplayName(file);
        });
        return fileName;
    };

    // scope functions
    $scope.buildColumns = function() {
        $scope.columns = [{
            label: 'Element Name',
            width: '25%'
        },{
            label: getRecordFileName($scope.record),
            handle: $scope.record,
            width: '40%'
        }];
        xelib.GetOverrides($scope.record).forEach(function(override) {
            $scope.columns.push({
                label: getRecordFileName(override),
                handle: override,
                width: '40%'
            })
        });
        $scope.resizeColumns();
    };

    $scope.buildTree = function() {
        let names = xelib.GetDefNames($scope.record);
        let handles = $scope.columns.map((column) => { return column.handle; });
        $scope.tree = $scope.buildStructNodes(handles.slice(1), -1, names);
    };

    // TODO: $scope.resolveNode
    // TODO: $scope.navigateToElement

    // initialization
    $scope.$watch('record', function(oldValue, newValue) {
        if (oldValue && oldValue !== newValue) xelib.Release(oldValue);
        overrides.forEach(xelib.Release);
        overrides = [];
        if (!xelib.IsMaster($scope.record)) {
            $scope.record = xelib.GetMaster($scope.record);
        } else {
            $scope.buildColumns();
            $scope.buildTree();
        }
    });

    $timeout($scope.resolveTreeElement, 100);
    $scope.autoExpand = true;
    $scope.record = xelib.GetElement(0, 'Skyrim.esm\\00012E46'); // TODO: remove this
};