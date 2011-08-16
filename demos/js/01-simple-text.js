// 01-simple-text.js

var demoTable;
var demoData = [];

$(document).ready(function() {
	demoTable = $('#demoTable').dataTable({
        "aaData": demoData,
        "aoColumns": [
            {"sTitle": "Item" },
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
        bAutoWidth: true,
        bJQueryUI: true
    });

   new RowEntry(demoTable, {
       "fnMakeRow" : function(dataTable, entryElement) {
	
			var text_value = entryElement.val()
			
			if(text_value == '') {
				alert("Nothing Entered")
				return null
			}

			return [text_value, ""]
		}
	});

});


