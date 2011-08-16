/*
 * dataTableRender.js
 *
 * Provides custom cell renderers for the jquery.dataTables plugin
 *
 */

(function($) {

    $.dataTableRenderer = function() {
    }

    $.dataTableRenderer.renderRadioButton = function(name, obj, editable) {
        if(editable == undefined) {
            editable = true
        }

        var checked = (obj.aData[obj.iDataColumn] == true || obj.aData[obj.iDataColumn] == 'true')

        return "<input name='" + name + "' type='radio'"  + "value='" + obj.iDataRow + "'"
                + (checked ? " checked='checked' " : "")
                + (editable ? "" : " disabled")
                + " />"
    }

    $.dataTableRenderer.renderButton = function(name, title, clazz, obj) {
        return "<button type='button' name='" + name + "' class='" + clazz + "'>" + title + "</button>"
    }


    $.dataTableRenderer.renderDiv = function(name, content, clazz, obj) {
       return "<div name='" + name + "' class='" + clazz + "'>" + content + "</div>"
    }

})(jQuery);