(function (window, define) {
    "use strict";
    window.METRO_DIALOG = true;
    define(
        [
            'jquery',
            'libs/jquery-ui/jquery.widget.min'
        ],
        function (jQuery) {
            require([
                'libs/metro-ui/components/metro-dialog',
                'libs/metro-ui/components/metro-touch-handler',
                'libs/metro-ui/components/metro-input-control',
                'libs/metro-ui/components/metro-button-set'
            ], function () {
                console.log('METRO loaded');
            });
        }
    );
}(window, define));

