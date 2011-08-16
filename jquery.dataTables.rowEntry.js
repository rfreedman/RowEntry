/**
 * jquery.dataTables.rowEntry.js
 *
 * a custom jQuery / dataTables widget for adding and deleting rows
 *
 * author: Rich Freedman
 * git repo: https://github.com/rfreedman/RowEntry
 *
 */

var RowEntryDeleteButtonRenderer;
var RowEntry;
var RowEntryInstances = new Array();

 (function($) {


	RowEntryDeleteButtonRenderer = function() {	
	}

	RowEntryDeleteButtonRenderer.prototype = {
	 	"render" : function(obj) {
			return "<div class='deleteEntryButton'></div>";
		}
	}

	// ----------------------------------------------------------------------------------------------------
	
    RowEntry = function(oDT, oConfig)
    {	
        /* Santiy check that we are a new instance */
        if (!this.CLASS || this.CLASS != "RowEntry")
        {
            alert("Warning: RowEntry must be initialised with the keyword 'new': class =  " + this.CLASS);
            return;
        }

        if (!$.fn.dataTableExt.fnVersionCheck('1.7.0'))
        {
            alert("Warning: RowEntry requires DataTables 1.7 or greater - www.datatables.net/download");
            return;
        }


        if (!oConfig || !oConfig.fnMakeRow)
        {
            alert("Warning: method 'fnMakeRow' must be supplied to RowEntry constructor - RowEntry not initialized");
            return;
        }


        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Public class variables
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
         this.s = {oDT:oDT}
         this.dom = {}


        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Public class methods
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        /**
		 * Retreieve the settings object from an instance
		 *  @method fnSettings
		 *  @returns {object} RowEntry settings object
		 */
        this.fnSettings = function() {
            return this.s;
        };
		
		this.deleteRow = function(deleteButton) {
			var trNode = $(deleteButton).closest("tr")[0];
			var rowIndex = this.oDT.fnGetPosition(trNode);
			this.oDT.fnDeleteRow(rowIndex);

            if(this._hasData()) {
			    this._openEntryRow();
            } else {
                this._setZeroRecordsEntryHtml();
            }

            if(this.s.fnOnDeleteRow) {
                this.s.fnOnDeleteRow()
            }
		}

        this.showEntryRow = function() {
           this._closeEntryRow();
           this._openEntryRow();
        }

        /* Constructor logic */
        this._fnInit(oDT, oConfig);

        return this;
    };



    RowEntry.prototype = {

	    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Private methods (they are of course public in JS, but recommended as private)
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        /**
		 * Initialisation
		 *  @method _fnInit
	 	 *  @param {object} oDT DataTables settings object
	 	 *  @param {object} oConfig Configuration object for RowEntry
		 *  @returns void
		 */
        "_fnInit": function(oDT, oConfig)
        {
            var
            that = this,
            i,
            iLen;

			this.oDT = oDT;
					
            /*
			 * Settings
			 */
            this.s.dt = oDT.fnSettings();

            this.dom.table = this.s.dt.nTable;
										
			// ensure an id
			if(!this.s.dt.nTable.id) {
				this.s.dt.nTable.id = 'RowEntryTable_' + Math.floor(Math.random()*101);
			}
									
			this.tableId = this.s.dt.nTable.id;
			this.entryId = this.tableId + "_entry"
			this.addButtonId = this.tableId + "_addButton"

            this.dom.defaultEntryElementHtml = "<input type='text' id='" + this.entryId + "' class='rowEntryInput'/>"
            this.dom.addButtonHtml = "<div id='" +  this.addButtonId + "' class='addEntryButton'></div>";
			
			RowEntryInstances[this.tableId] = this;
			
            if(oConfig.entryElementHtml) {
                this.s.tableEntryRowHtml = oConfig.entryElementHtml + this.dom.addButtonHtml;
            } else {
			    this.s.tableEntryRowHtml = this.dom.defaultEntryElementHtml + this.dom.addButtonHtml;
            }

			if(oConfig.fnProvideEntryElementHtml) {
				this.s.fnProvideEntryElementHtml = oConfig.fnProvideEntryElementHtml
			}

            if(oConfig.fnOnAddRow) {
                this.s.fnOnAddRow = oConfig.fnOnAddRow
            }

            if(oConfig.fnOnDeleteRow) {
                this.s.fnOnDeleteRow = oConfig.fnOnDeleteRow
            }

            this._setZeroRecordsEntryHtml()
			
			this.s.fnMakeRow = oConfig.fnMakeRow;			
			this._initDeleteButtonColumn();			
			this._initBlankRow();

            oDT.fnDraw();				
        },


        "_setZeroRecordsEntryHtml" : function() {
			// update the "sZeroRecords" output
			var oLanguage = this.oDT.fnSettings()
			oLanguage.sZeroRecords =  this._getRowEntryHtml()
			this.oDT.oApi._fnLanguageProcess(this.oDT.fnSettings(), oLanguage, false)
            this.oDT.fnDraw()
        } ,

		"_getRowEntryHtml" : function() {
			if(this.s.fnProvideEntryElementHtml) {
				return this.s.fnProvideEntryElementHtml(this.oDT) + this.dom.addButtonHtml;
			} else {
				return this.s.tableEntryRowHtml;
			}
		},
		
		"_getRowCount" : function() {
			return this.oDT.fnGetData().length;
		},
		
		"_getColumnCount" : function() {
			return this.oDT.fnSettings().aoColumns.length;	
		},
		
		"_hasData" : function() {
			return this._getRowCount() > 0;
		},
		
		"_initDeleteButtonColumn" : function() {
		    $(".deleteEntryButton", this.dom.table).live('click', function() {
				var tableElement = $(this).closest("table");
				var dataTable = RowEntryInstances[tableElement.attr('id')];
				dataTable.deleteRow(this);
		    });
		},
		
		"_initBlankRow" : function() {			
		   $(".addEntryButton", this.dom.table).live('click', function() {
				var tableElement = $(this).closest("table");
				var dataTable = RowEntryInstances[tableElement.attr('id')];
				var entrySelector = "#" + dataTable.entryId;
				
				var entryElement = $(entrySelector);			
				
				if(entryElement.length == 0) {
					alert('did not find entry element with id: ' + dataTable.entryId)
					return false;
				}

				var newEntry = dataTable.fnSettings().fnMakeRow(dataTable.oDT, entryElement);
				if(newEntry) {
			        dataTable._closeEntryRow();
			        dataTable._addEntry(newEntry);
			        dataTable._openEntryRow();					
				}
			    return false;

		    });	
			
			if(this._hasData()) {
				this._openEntryRow();
			}
		},
		
		"_openEntryRow" : function() {
			var rowNode = this.oDT.fnGetNodes(this._getRowCount() - 1);
			
			this.oDT.fnOpen(rowNode, this._getRowEntryHtml(), "blank_row");
		},
		
		"_closeEntryRow" : function() {
			var rowCount = this._getRowCount();
		    if(rowCount > 0) {
		        var rowNode = this.oDT.fnGetNodes((rowCount - 1));
		        this.oDT.fnClose(rowNode)
		    }
		    return false;			
		},
		
		"_addEntry" : function(newEntry) {
			this.oDT.fnAddData(newEntry)

            if(this.s.fnOnAddRow) {
                this.s.fnOnAddRow()
            }

		},
		
		"_renderDiv" : function(name, content, clazz, obj) {
		       return "<div name='" + name + "' class='" + clazz + "'>" + content + "</div>"
		},
		
		"_renderDeleteButton" : function(obj) {
			return this._renderDiv("deleteButton_" + tableId + "_" + obj.iDataRow, "",  "deleteEntryButton", obj)
		}

    };




    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constants
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /**
	 * Name of this class
	 *  @constant CLASS
	 *  @type     String
	 *  @default  AutoFill
	 */
    RowEntry.prototype.CLASS = "RowEntry";


    /**
	 * RowEntry version
	 *  @constant  VERSION
	 *  @type      String
	 *  @default   1.1.1
	 */
    RowEntry.VERSION = "0.0.1";
    RowEntry.prototype.VERSION = "0.0.1";


})(jQuery);