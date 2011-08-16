// 01-simple-text.js

var demoTable;
var demoData = [];

var allItems = [
	{id:1, name:'super'},
	{id:2, name:'cali'}, 
	{id:3, name:'fragilistic'}, 
	{id:4, name:'expi'}, 
	{id:5, name:'alidocious'}
]

$(document).ready(function() {
	demoTable = $('#demoTable').dataTable({
        "aaData": demoData,
        "aoColumns": [
	        {
	            "sTitle": "id",
	            "bVisible": false
	        },
            {
				"sTitle": "Item",
				"sWidth": "450px"
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
        bAutoWidth: true,
        bJQueryUI: true
    });

   new RowEntry(demoTable, {
		"fnProvideEntryElementHtml" : function(dataTable) {
			var html = "<select id='demoTable_entry' style='width:450px;margin-right:14px;'>"
					 + "<option disabled>-- select an item --</option>";
			
		    $.each(allItems, function(i, item) {
				var exists = findItemInTable(dataTable, item.id)

		        html += "<option value='" + item.id + "'" + (exists == null ? "" : "disabled") + ">" + item.name + "</option>";
		    });		
					
			html += "</select>";			

			return html;
		},

       "fnMakeRow" : function(dataTable, entryElement) {
			var id_value = entryElement.val();
			var text_value = $(':selected', entryElement).text()

			if(text_value == id_value) {
				alert("No Item Selected")
				return null
			}

			// make sure that the item isn't already in the list
			var found = findItemInTable(dataTable, id_value)
			if(found != null) {
				alert("Item: " + text_value + ' has already been selected')
				return null
			}

			return [id_value, text_value, ""]
       }
	});

});

function findItemInTable(dataTable, id_value) {
	var found = null;
	$.each(dataTable.fnGetData(), function(index, value){
		if(value[0] == id_value) {
			found = index
			return false // exit the 'each' loop
		}
	});	
	return found;
}

