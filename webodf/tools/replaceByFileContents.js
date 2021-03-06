/**
 * Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.  The code is distributed
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this code.  If not, see <http://www.gnu.org/licenses/>.
 *
 * As additional permission under GNU AGPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * As a special exception to the AGPL, any HTML file which merely makes function
 * calls to this code, and for that purpose includes it by reference shall be
 * deemed a separate work for copyright law purposes. In addition, the copyright
 * holders of this code give you permission to combine this code with free
 * software libraries that are released under the GNU LGPL. You may copy and
 * distribute such a system following the terms of the GNU AGPL for this code
 * and the LGPL for the libraries. If you modify this code, you may extend this
 * exception to your version of the code, but you are not obligated to do so.
 * If you do not wish to do so, delete this exception statement from your
 * version.
 *
 * This license applies to this entire compilation.
 * @licend
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */
/*global runtime, core*/

/**
 * tool used in build process.
 *
 * this tool reads argv[1] and writes it to argv[2]
 * after replacing every occurance of argv[2n+1] with
 * the contents of the file argv[2n+2]
 * (for n>0)
 *
 */

function run(input_file, output_file, keywords) {
	"use strict";
	var repl_done, inp_data;
    try {
        inp_data = runtime.readFileSync(input_file, "utf-8");
    } catch (err) {
		runtime.log("failed to read input_file \"" + input_file + "\":");
		runtime.log(err);
		return;
	}

	repl_done = [];
	keywords.forEach(function (trans) {
		if ((trans.from && trans.to)) {
			runtime.log("replacing \"" + trans.from + "\" with contents of [" + trans.to + "].");
			runtime.readFile(trans.to, "utf-8", function (err, repl_data) {
				if (err) {
					runtime.log(err);
					return;
				}
				// "function() { return repl_data; }" is used to avoid possible replacement patterns in repl_data, e.g. $&
				inp_data = inp_data.replace(new RegExp(trans.from, "g"), function() { return repl_data; });

				repl_done.push(trans);
				if (repl_done.length === keywords.length) {
					runtime.writeFile(output_file, inp_data, function (err) {
						if (err) {
							runtime.log(err);
							return;
						}
					});
				}
			});
		} else {
			runtime.log("skipping replacement: [" + trans.from + "] / [" + trans.to + "]");
		}

	});
}

var i, input_file, output_file, keywords = [];
i = 1;
input_file = arguments[i];
i += 1;
output_file = arguments[i];
i += 1;

for (; i + 1 < arguments.length; i += 2) {
	keywords.push({
		from: arguments[i],
		to: arguments[i + 1]
	});
}
runtime.log("filtering [" + input_file + "] to [" + output_file + "]");
run(input_file, output_file, keywords);
