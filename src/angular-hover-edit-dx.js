/**
 * Created by ericjohndixon on 7/29/15.
 */
// Code goes here
(function () {
    'use strict';

    angular.module('angularHoverEdit', [])
        .directive('hoverEdit', ['$animate', '$compile', function ($animate, $compile) {
            return {
                priority: 100,
                restrict: 'EA',
                require: ['?hoverEditPermissions', '?messageService'],
                scope: {
                    saveFn: '=?saveFn',
                    addFn: '=?addFn',
                    cancelFn: '=?cancelFn',
                    unitToSave: '=?unitToSave',
                    editMode: '=?editMode', //external trigger
                    formName: '@formName',
                    readOnly: '=?readOnly'
                },
                transclude: true,
                template: '<div class="animated-element edit-container" ' +
                'ng-mouseover="(!editMode.on) ? triggerhoverAnimation(false) : \'\'" ' +
                'ng-mouseleave="(!editMode.on) ? triggerhoverAnimation(true) : \'\'" ' +
                'ng-click="setEditMode()"ng-transclude></div>',
                link: function (scope, element, attrs, ctrls) {
                    var elemIcon = angular.element('<span class="top-rt-corner-box"><i class="lds-icon lds-icon-pencil"></i></span>');
                    var saveExitIcons = angular.element('<div class="save-exit-btns">'+
                        '<button class="btn btn-danger-hover" ng-disabled="showSpinner" ng-show="editMode.on" ng-click="functions.cancel()" tooltip-popup-delay="500" tooltip-append-to-body="true" tooltip="Cancel Changes" style="float: right">CANCEL</button>' +
                        '<button class="btn btn-success-hover" ng-disabled="showSpinner" type="submit" form="{{formName}}" ng-show="editMode.on" ng-click="functions.save()" tooltip-popup-delay="500" tooltip-append-to-body="true" tooltip="Save Changes" style="float: right;margin-right: 2px">SAVE</button>' +

                        '</div>');
                    var addIcon = angular.element('<button class="margin-bot-5 btn btn-default add-btn add-restriction" ng-show="editMode.on" ng-click="setEditMode(true)" tooltip-popup-delay="500" tooltip-append-to-body="true" tooltip="Add Restriction"><i class="lds-icon lds-icon-add"></i> </button>');
                    var saveSpinner = angular.element('<div class="hover-edit-spinner" ng-show="showSpinner"><util-spinner></util-spinner></div>');


                    var editBox = element.children('.editContainer');
                    scope.cancelClick = function cancelClick(event) {
                        event;
                    };

                    scope.$watch('readOnly', function(nv, ov) {
                        if (nv != ov) {
                            if (nv) {
                                scope.triggerhoverAnimation = null;
                                scope.setEditMode = null;
                                elemIcon.remove();
                            } else {
                                if(!ctrls[0] || ctrls[0].hasPermissions) {
                                    scope.triggerhoverAnimation = triggerhoverAnimation;
                                    scope.setEditMode = setEditMode;
                                    editBox.append(elemIcon);
                                    $compile(elemIcon)(scope);
                                }
                            }
                        }
                    });

                    if(!scope.readOnly && (!ctrls[0] || ctrls[0].hasPermissions)) {
                        scope.triggerhoverAnimation = triggerhoverAnimation;
                        scope.setEditMode = setEditMode;
                    }

                    scope.functions = {
                        save: save,
                        cancel: cancel
                    };
                    //scope.cancel = cancel;

                    setupElements();
                    scope.editMode = { on : false};
                    scope.showIcon = false;
                    scope.showSpinner = false;

                    //trigger hover animation for mouseover(leaving = false) or mouseleaving (leaving = true)
                    function triggerhoverAnimation(leaving) {
                        if (!scope.editMode.on) {
                            //var outerBox = document.querySelector("#editContainer");
                            var outerBox = element.children('.editContainer')[0];

                            if (outerBox !== null)
                            {
                                outerBox = angular.element(outerBox);

                                if (leaving) {
                                    $animate.addClass(outerBox, 'edit-box');
                                    $animate.removeClass(outerBox, 'box-border');
                                    scope.showIcon = false;

                                }
                                else {
                                    $animate.addClass(outerBox, 'box-border');
                                    $animate.removeClass(outerBox, 'edit-box');
                                    scope.showIcon = true;
                                }
                            }
                        }
                    }


                    // clicking box for editing
                    function setEditMode (addMode) {
                        if(addMode && _.isFunction(scope.addFn())) {
                            scope.addFn();
                        }
                        var outerBox = element.children('.editContainer');
                        scope.editMode.on = true;
                        $animate.removeClass(element, 'disabled');
                        $animate.addClass(outerBox, 'box-border');
                        $animate.removeClass(outerBox, 'edit-box');
                    }

                    //Save Icon Click
                    function save() {
                        //if there is a form associated with the element
                        var form = angular.element(document.getElementById(scope.formName));

                        //Only able to save if form is valid
                        if (!form || !form.hasClass('ng-invalid')) {
                            if (_.isFunction(scope.saveFn)) {
                                scope.showSpinner = true;
                                scope.saveFn(scope.unitToSave).then(function () {
                                    scope.showSpinner = false;
                                    //$compile(saveExitIcons)(scope);
                                    scope.editMode.on = false;
                                    hideEditElements();

                                    if(ctrls[1]) {
                                        ctrls[1].showMessage.success('')('Save Successful');
                                    }
                                }).catch(function() {
                                    scope.showSpinner = false;
                                });
                            } else {
                                scope.editMode.on = false;
                                hideEditElements();
                            }
                        }

                    }

                    //Cancel Icon Click
                    function cancel() {
                        scope.editMode.on = false;
                        if(_.isFunction(scope.cancelFn)) {
                            scope.cancelFn();
                        }
                        hideEditElements();
                    }

                    // initial creation of elements
                    function setupElements() {
                        if(_.isFunction(scope.addFn)) {
                            editBox.after(addIcon);
                            $compile(addIcon)(scope);
                        }
                        if (!scope.readOnly && (!ctrls[0] || ctrls[0].hasPermissions)) {
                            editBox.append(elemIcon);
                            $compile(elemIcon)(scope);
                        }
                        if(!ctrls[0] || ctrls[0].hasPermissions) {
                            editBox.after(saveSpinner);
                            editBox.after(saveExitIcons);
                            $compile(saveSpinner)(scope);
                            $compile(saveExitIcons)(scope);
                        }

                        editBox.addClass('edit-box');
                        element.addClass('disabled');
                    }

                    function hideEditElements() {
                        triggerhoverAnimation(true);
                        element.addClass('disabled');
                    }
                }
            };
        }])
        .directive('utilSpinner', [function () {
            return {
                restrict: 'E',
                template: '<span us-spinner="{radius:4, width:2, length: 2, lines: 9, scale: 1.5, corners: 1.0, speed: 2.0, hwaccel: true, trail: 100, className: className}"></span>',
                scope: {
                    className: '@className'
                }
            };

        }])
        .directive('hoverEditLink', [function(){
            return {
                restrict: 'EA',
                template: '<span class="hover-edit-link" ng-click="hoverEditLink.redirectToLink($event)" ng-transclude></span>',
                transclude: true,
                scope: {
                    link: '@link'
                },
                bindToController: true,
                controllerAs: 'hoverEditLink',
                controller: ['$location', function($location){
                    var hoverEditLink = this;
                    hoverEditLink.redirectToLink = function(event) {
                        //disallow edit mode if link is clicked
                        event.stopPropagation();

                        // will add '/' if missing
                        $location.path(hoverEditLink.link);
                    }
                }]
            }
        }]);

})();
