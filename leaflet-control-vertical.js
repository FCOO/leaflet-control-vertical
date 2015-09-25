/**
 * Adds a vertical selector to Leaflet based maps.
 **/
if (console === undefined) {
    this.console = { log: function (msg) { /* do nothing since it would otherwise break IE */} };
}

L.Control.Vertical = L.Control.extend({
    options: {
        title: null,
        language: null,
        levels: [],
        initialLevelIndex: 0,
        units: null,
        onChange: function(){},
        position: 'bottomleft',
        visibility: 'visible',
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._container = L.DomUtil.create('div', 'leaflet-control leaflet-control-vertical');
        if (this.options.visibility == 'hidden') {
            $(this._container).css("visibility", this.options.visibility);
        }
        L.DomEvent.disableClickPropagation(this._container);
        this._createVerticalSelector(this._container);
    },

    onAdd: function(map) {
        this._map = map;
        return this._container;
    },

    onRemove: function(map) {
        this._container.style.display = 'none';
        this._map = null;
    },

    _createVerticalSelector: function(container) {
        var that = this;
        // Add title div
        if (this.options.title) {
            var titleDiv = L.DomUtil.create('div', 'leaflet-control-vertical-title', container);
            titleDiv.innerHTML = this.options.title;
        }

        // Create select element
        var selectList = L.DomUtil.create('select', 'leaflet-control-vertical-select', container);
        selectList._instance = this;
        $.each(this.options.levels, function ( index, value ) {
            var option = document.createElement("option");
            option.value = value;
            option.text = value;
            if (that.options.units !== null) {
                option.text +=  ' ' + that.options.units;
            }
            selectList.appendChild(option);
        });

        // Add event listener
        $(selectList).on("change", this.options.onChange);

        // Set initial value
        selectList.selectedIndex = this.options.initialLevelIndex;

        // Trigger event
        $(selectList).trigger("change");
    }
});

L.Control.vertical = function(options) { return new L.Control.Vertical(options); };
