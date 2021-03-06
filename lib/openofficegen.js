//
// officegen: basic OpenOffice common code
//
// Please refer to README.md for this module's documentations.
//
// NOTE:
// - Before changing this code please refer to the hacking the code section on README.md.
//
// Copyright (c) 2013 Ziv Barber;
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

var baseobj = require("./basicgen.js");

///
/// @brief Extend officegen object with OpenOffice support.
///
/// This method extending the given officegen object with the common OpenOffice code.
///
/// @param[in] genobj The object to extend.
/// @param[in] new_type The type of object to create.
/// @param[in] options The object's options.
/// @param[in] gen_private Access to the internals of this object.
/// @param[in] type_info Additional information about this type.
///
function makeoodoc ( genobj, new_type, options, gen_private, type_info ) {
	///
	/// @brief Get the string that opening every Office XML type.
	///
	/// Every OpenOffice XML resource will have this header at the begining of the file.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	gen_private.plugs.makeOpenOfficeBasicXml = function ( data ) {
		return '<?xml version="1.0" encoding="UTF-8"?>\n';
	}

	///
	/// @brief Create the mimetpe resource.
	///
	/// Every OpenOffice based document must have this resource.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function makeOpenOfficeMimeType ( data ) {
		return 'application/vnd.oasis.opendocument.' + gen_private.mixed.res_data.mimeType;
	}

	///
	/// @brief Generate the manifest XML resource.
	///
	/// Tbis function creating the manifest resource.
	///
	/// @param[in] data Array filled with all the resources information.
	/// @return Text string.
	///
	gen_private.plugs.makeManifest = function ( data ) {
		var outString = gen_private.plugs.makeOpenOfficeBasicXml ( data );
		outString += '<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">\n';

		// Add all the rels records inside the data array:
		for ( var i = 0, total_size = data.length; i < total_size; i++ ) {
			if ( typeof data[i] != 'undefined' ) {
				outString += ' <manifest:file-entry manifest:media-type="' + data[i].type + '" manifest:full-path="' + data[i].target + '"/>\n';
			} // Endif.
		} // End of for loop.

		outString += '</manifest:manifest>\n';
		return outString;
	}

	///
	/// @brief Prepare the officegen object to OpenOffice documents.
	///
	/// Every plugin that implementing gemenrating OpenOffice document must call this method to initialize 
	/// the common stuff.
	///
	/// @param[in] mimeType The mime type of this document.
	/// @param[in] ext_opt Optional settings (unused right now).
	///
	gen_private.plugs.makeOfficeGenerator = function ( mimeType, ext_opt ) {
		gen_private.mixed.res_data.mimeType = mimeType;
		gen_private.mixed.files_list = [];

		gen_private.mixed.files_list.push (
			{
				name: 'content.xml',
				type: 'text/xml'
			},
			{
				name: 'settings.xml',
				type: 'text/xml'
			},
			{
				name: 'styles.xml',
				type: 'text/xml'
			},
			{
				name: 'manifest.rdf',
				type: 'application/rdf+xml'
			},
			{
				name: 'meta.xml',
				type: 'text/xml'
			}
		);

		gen_private.plugs.intAddAnyResourceToParse ( 'mimetype', 'buffer', null, makeOpenOfficeMimeType, true );
		gen_private.plugs.intAddAnyResourceToParse ( 'META-INF\\manifest.xml', 'buffer', gen_private.mixed.rels_main, gen_private.plugs.cbMakeRels, true );
		// gen_private.plugs.intAddAnyResourceToParse ( 'settings.xml', 'buffer', null, make???, true );
		// gen_private.plugs.intAddAnyResourceToParse ( 'styles.xml', 'buffer', null, make???, true );
		// gen_private.plugs.intAddAnyResourceToParse ( 'manifest.rdf', 'buffer', null, make???, true );
		// gen_private.plugs.intAddAnyResourceToParse ( 'meta.xml', 'buffer', null, make???, true );
	}
}

exports.makeoodoc = makeoodoc;

