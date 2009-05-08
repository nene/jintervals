/**
 * jintervals -- JavaScript library for interval formatting
 *
 * jintervals is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * jintervals is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with jintervals. If not, see
 * <http://www.gnu.org/licenses/>.
 *
 * Copyright (c) 2009 Rene Saarsoo <http://code.google.com/p/jintervals/>
 *
 */
var jintervals = (function() {
  function jintervals(seconds, format) {
    // precalculate all different intervals we might need
    var t = {};
    t.D = Math.floor(seconds / (60*60*24));
    t.d = t.D;
    t.H = Math.floor(seconds / (60*60));
    t.h = t.H - (t.D*24);
    t.M = Math.floor(seconds / 60);
    t.m = t.M - (t.H*60);
    t.S = Math.floor(seconds);
    t.s = t.S - (t.M*60);
    // Determine the name of greatest unit
    t.G = t.d ? "d" : (t.h ? "h" : (t.m ? "m" : "s"));
    t.g = t.G;
    
    return Interpreter.evaluate(t, Parser.parse(format));
  };
      
  /**
   * Parses format string into data structure,
   * that can be interpreted later.
   */
  var Parser = {
    parse: function(format) {
      var unparsed = format;
      var result = [];
      while ( unparsed.length > 0 ) {
        // leave plain text untouched
        var textMatch = /^([^\\{]+)([\\{].*|)$/.exec(unparsed);
        if (textMatch) {
          result.push(textMatch[1]);
          unparsed = textMatch[2];
        }
        
        // parse jintervals {Code} separately
        var match = /^([{].*?(?:[}]|$))(.*)$/i.exec(unparsed);
        if (match) {
          result.push(this.parseCode(match[1]));
          unparsed = match[2];
        }
        
        // backslash escapes next character
        // transform \{ --> {
        // transform \\ --> \
        if (unparsed.charAt(0) === "\\") {
          result.push(unparsed.charAt(1));
          unparsed = unparsed.slice(2);
        }
      }
      return result;
    },
    
    // parses single {Code} in format string
    // Returns object representing the code or false when incorrect format string
    parseCode: function(code) {
      var re = /^[{]([smhdg])([smhdg]*)?(ays?|ours?|inutes?|econds?|reatests?|\.)?(\?(.*))?[}]$/i;
      var matches = re.exec(code);
      if (!matches) {
        return false;
      }
      
      return {
        type: matches[1],
        paddingLength: (matches[2] || "").length + 1,
        format: (matches[3]||"") == "" ? false : (matches[3] == "." ? "letter" : "full"),
        optional: !!matches[4],
        optionalSuffix: matches[5] || ""
      };
    }
    
  };
      
  /**
   * Evaluates parse tree in the context of given time interval
   */
  var Interpreter = {
    evaluate: function(time, parseTree) {
      var result = "";
      while ( parseTree.length > 0 ) {
        var code = parseTree.shift();
        // leave plain text untouched
        if (typeof code === "string") {
          result += code;
        }
        
        // evaluate the code
        else if (typeof code === "object") {
          var type = (code.type.toUpperCase() == "G") ? time.G : code.type;
          var value = time.hasOwnProperty(type) ? time[type] : "?";
          var suffix = code.format ? Localization.translate(code.format, type.toLowerCase(), value) : "";
          
          // show when not optional or totalvalue is non-zero
          if (!code.optional || time[type.toUpperCase()] != 0) {
            result += this.zeropad(value, code.paddingLength) + suffix + code.optionalSuffix;
          }
        }
        
        // otherwise we have error
        else {
          result += "?";
        }
      }
      return result;
    },
    
    // utility function to pad number with leading zeros
    zeropad: function(nr, decimals) {
      var padLength = decimals - (""+nr).length;
      return (padLength > 0) ? this.repeat("0", padLength) + nr : nr;
    },
    
    // utility function to repeat string
    repeat: function(string, times) {
      var result = "";
      for (var i=0; i < times; i++) {
        result += string;
      }
      return result;
    }
  };
  
  
  var Localization = {
    translate: function(format, lcType, value) {
      var loc = this.locales[this.currentLocale];
      var translation = loc[format][lcType];
      if (typeof translation === "string") {
        return translation;
      }
      else {
        return translation[loc.plural(value)];
      }
    },
    
    locale: function(loc) {
      if (loc) {
        this.currentLocale = loc;
      }
      return this.currentLocale;
    },
    
    currentLocale: "en_US",
    
    locales: {
      en_US: {
        letter: {
          d: "d",
          h: "h",
          m: "m",
          s: "s"
        },
        full: {
          d: [" day", " days"],
          h: [" hour", " hours"],
          m: [" minute", " minutes"],
          s: [" second", " seconds"]
        },
        plural: function(nr) {
          return (nr == 1) ? 0 : 1;
        }
      },
      et_EE: {
        letter: {
          d: "p",
          h: "h",
          m: "m",
          s: "s"
        },
        full: {
          d: [" p\u00E4ev", " p\u00E4eva"],
          h: [" tund", " tundi"],
          m: [" minut", " minutit"],
          s: [" sekund", " sekundit"]
        },
        plural: function(nr) {
          return (nr == 1) ? 0 : 1;
        }
      }
    }
  };
  
  // Changing and getting current locale
  jintervals.locale = function(loc) {
    return Localization.locale(loc);
  };
  
  return jintervals;
})();


