/****************************************************************************
    leaflet-control-vertical.js, 

    (c) 2016, FCOO

    https://github.com/FCOO/leaflet-control-vertical
    https://github.com/FCOO

****************************************************************************/
(function ($, L, window, document, undefined) {
    "use strict";

    /**
     * Adds a vertical selector to Leaflet based maps.
     **/
    if (console === undefined) {
        this.console = { log: function ( /*msg*/ ) { /* do nothing since it would otherwise break IE */} };
    }

    L.Control.Vertical = L.Control.extend({
    options: {
        VERSION: "{VERSION}",
        title: '',
        levels: [],
        initialLevelIndex: 0,
        units: null,
        position: 'bottomleft',
        visibility: 'visible',
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._container = L.DomUtil.create('div', 'leaflet-control leaflet-control-vertical');
        if (this.options.visibility == 'hidden') {
            $(this._container).hide();
            $(this._container).css("visibility", 'hidden');
        }
        L.DomEvent.disableClickPropagation(this._container);
        this._createVerticalSelector(this._container);
        this._vertical_layers = 0;
    },

    onAdd: function(map) {
        var _this = this;
        this._map = map;

        // Trigger change event to initialize layers
        $(this._selectList).trigger("change");

        // We want to trigger a change event when a new layer is added
        // and we also want to make the selector visible
        map.on("layeradd", function(data) {
            if (data.layer.levels !== undefined) {
                _this._vertical_layers += 1;
                $(_this._container).show();
                $(_this._container).css("visibility", 'visible');
                $(_this._selectList).trigger("change");
            }
        });
        // Make the selector hidden if there are no vertical layers on map
        map.on("layerremove", function(data) {
            if (data.layer.levels !== undefined) {
                _this._vertical_layers -= 1;
                if (_this._vertical_layers === 0) {
                    $(_this._container).hide();
                    $(_this._container).css("visibility", 'hidden');
                }
            }
        });
        return this._container;
    },

    onRemove: function( /*map*/ ) {
        this._container.style.display = 'none';
        this._map = null;
    },

    onChange: function(/*evt, ee*/){
        var map = this._instance._map;
        if (map) {
            var data = {
                index: this.selectedIndex,
                value: $(this).val()
            };
            map.fire('levelchange', data);
        }
    },

    _createVerticalSelector: function(container) {
        var _this = this;
        // Add title div
        if (this.options.title) 
            $('<div/>')
                .addClass('leaflet-control-vertical-title')
                .i18n( this.options.title )
                .appendTo( container );
/*
        {
            var titleDiv = L.DomUtil.create('div', 'leaflet-control-vertical-title', container);
            titleDiv.innerHTML = this.options.title;
        }
*/
        // Create select element
        var selectList = L.DomUtil.create('select', 'leaflet-control-vertical-select', container);
        selectList._instance = this;
        this._selectList = selectList;
        $.each(this.options.levels, function ( index, value ) {
            var option = document.createElement("option");
            option.value = value;
            var text = value;
            if (_this.options.units !== null) {
                text +=  ' ' + _this.options.units;
            }
            $(option).text(text);
            selectList.appendChild(option);
        });

        // Add event listener
        $(selectList).on("change", this.onChange);

        // Set initial value
        selectList.selectedIndex = this.options.initialLevelIndex;
    }
    });

    L.Control.vertical = function(options) { return new L.Control.Vertical(options); };

}(jQuery, L, this, document));



