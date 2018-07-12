var Pronext = Pronext || {};

Pronext.RegistroFieldRenderer = (function () {
  var RegistroTemplate = function (ctx) {
    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);

    // Register a callback just before submit. 
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
      return document.getElementById('ddlRegistro').value;
    });

    var value = formCtx.fieldValue;
    var splitValue = value.split(';#');
    if (splitValue.length) {
      value = splitValue[0];
    }

    return "<select id='ddlRegistro' value='" + value + "'/>";
  };

  var getAjax = function (url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Accept', 'application/json;odata=verbose');
    xhr.send();
    return xhr;
  };

  var loadData = function (callback) {
    var listName = 'Registro';
    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/Web/Lists/GetByTitle('" + listName + "')/Items?$filter=ControleDocumentoRelacionado eq 1";
    getAjax(url, function (data) {
      var items = JSON.parse(data);
      callback(null, items.d.results.map(function (item) {
        return {
          value: item.ID,
          text: item.Title
        };
      }));
    });
  };

  var clearDropDown = function (ddl) {
    if (ddl) {
      ddl.options.length = 0;
    }
  };
onRegistroPostRender
  var onRegistroPostRender = function () {
    // generate the options
    loadData(function (err, data) {
      if (!err) {
        var ddl = document.getElementById('ddlRegistro');

        clearDropDown(ddl);

        data.forEach(function (item) {
          var option = document.createElement("option");
          option.text = item.text;
          option.value = item.value;

          ddl.add(option);
        });

        ddl.value = ddl.getAttribute('value');
      }
    });
  };

  var context = {};
  context.Templates = {};
  context.Templates.Fields = {
    "Registro": {
      "EditForm": RegistroTemplate
    }
  };

  context.OnPostRender = onRegistroPostRender;

  SPClientTemplates.TemplateManager.RegisterTemplateOverrides(context);
})();
