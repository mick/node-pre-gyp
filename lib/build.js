
module.exports = exports = build

exports.usage = 'Attempts to compile the module by dispatching to node-gyp'

var fs = require('fs')
  , compile = require('./util/compile.js')

function build(gyp, argv, callback) {
    var node_gyp_args = [];
    if (argv.length && argv[0] == 'rebuild') {
        node_gyp_args.push('rebuild');
    } else {
        node_gyp_args.push('configure');
        node_gyp_args.push('build');
    }
    var package_json = JSON.parse(fs.readFileSync('./package.json'));
    // options look different depending on whether node-pre-gyp is called directly
    // or whether it is called from npm install, hence the following two lines.
    var command_line_opts = (typeof(gyp.opts.argv.original) === 'string') ? JSON.parse(gyp.opts.argv).original : gyp.opts.argv.original || [];
    command_line_opts = command_line_opts.filter(function(opt) { return opt.length > 2 && opt.slice(0,2) == '--'});
    compile.run_gyp(node_gyp_args.concat(command_line_opts),gyp.opts,function(err,opts) {
        return callback(err);
    });
}
