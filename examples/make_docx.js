
var officegen = require('../lib/index.js');

var fs = require('fs');

var docx = officegen ( 'docx' );

docx.on ( 'finalize', function ( written ) {
			console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
		});

docx.on ( 'error', function ( err ) {
			console.log ( err );
		});

var pObj = docx.createP ();

pObj.addText ( 'Simple' );
pObj.addText ( ' with color', { color: '000088' } );
pObj.addText ( ' and back color.', { color: '00ffff', back: '000088' } );

var pObj = docx.createP ();

pObj.addText ( 'Bold + underline', { bold: true, underline: true } );

var pObj = docx.createP ( { align: 'center' } );

pObj.addText ( 'Center this text.' );

var pObj = docx.createP ();
pObj.options.align = 'right';

pObj.addText ( 'Align this text to the right.' );

docx.putPageBreak ();

var pObj = docx.createP ();

pObj.addText ( 'Fonts face only.', { font_face: 'Arial' } );
pObj.addText ( ' Fonts face and size.', { font_face: 'Arial', font_size: 40 } );

docx.putPageBreak ();

var pObj = docx.createListOfNumbers ();

pObj.addText ( 'Option 1' );

var pObj = docx.createListOfNumbers ();

pObj.addText ( 'Option 2' );

var out = fs.createWriteStream ( 'out.docx' );

out.on ( 'error', function ( err ) {
	console.log ( err );
});

docx.generate ( out );

