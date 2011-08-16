// 01-simple-text.js

var demoTable;
var demoData = [];

$(document).ready(function() {
	demoTable = $('#demoTable').dataTable({
        "aaData": demoData,
        "aoColumns": [
            {
				"sTitle": "Item",
				"sWidth": "400px"
			},
            {
                "sTitle": "Primary",
				"sWidth": "24px",
                "sClass": "center",

                "fnRender": function(obj) {
                    return $.dataTableRenderer.renderRadioButton("primaryItemIndex", obj)
                },

                "bUseRendered": false
            },
            {
                "sTitle": "",
                fnRender:  new RowEntryDeleteButtonRenderer().render
            }
        ],
        bPaginate: false,
        bLengthChange: false,
        bFilter: false,
        bSort: false,
        bInfo: false,
        bAutoWidth: false,
        bJQueryUI: true
    });

   new RowEntry(demoTable, {
       "fnMakeRow" : function(dataTable, entryElement) {
	
			var text_value = entryElement.val()
			
			if(text_value == '') {
				alert("Nothing Entered")
				return null
			}

			return [text_value, (dataTable.fnGetData().length == 0), ""]
		}
	});

});


