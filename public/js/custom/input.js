var SPMaskBehavior = function (val) {
	return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},
spOptions = {
	onKeyPress: function(val, e, field, options) {
		field.mask(SPMaskBehavior.apply({}, arguments), options);
	}
};

$('#txt-telefone').mask(SPMaskBehavior, spOptions);

$(function() {
	$( "#txt-nome" ).autocomplete({
		source: function( request, response ) {		
			$.ajax({
				type: 'POST',
				url: "/gerausuario",
				data: {
					nome: request.term
				},
				success: function( data ) {
					$("#txt-username").val(data);

				}
			});
		},
		minLength: 3
	});
});