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
  // utility function to pad number with leading zeros
  function zeropad(nr, decimals) {
    var padLength = decimals - (""+nr).length;
    return (padLength > 0) ? repeat("0", padLength) + nr : nr;
  }

  // utility function to repeat string
  function repeat(string, times) {
    var result = "";
    for (var i=0; i < times; i++) {
      result += string;
    }
    return result;
  }

  // interprets a single interval code -- the text between { and }
  // returns the corresponding value
  function evalCode(code, t) {
    var re = /^[{](s|m|h|d)(s*|m*|h*|d*)?(ays|ours|inutes|econds|\.)?(\?(.*))?[}]$/i;
    var matches = re.exec(code);
    if (!matches) {
      return "?";
    }
    
    var type = matches[1];
    var value = t.hasOwnProperty(type) ? t[type] : "?";
    var paddingLength = (matches[2] || "").length + 1;
    var suffix = getSuffix((matches[3] || ""), type, value);
    var optional = !!matches[4];
    var optionalSuffix = matches[5] || "";
    
    // hide when ? modifier is present and totalvalue is zero
    if (optional && t[type.toUpperCase()] == 0) {
      return "";
    }
    
    return zeropad(value, paddingLength) + suffix + optionalSuffix;
  }
  
  function getSuffix(suffixType, type, value) {
    var lcType = type.toLowerCase();
    
    if (suffixType == "") {
      return "";
    }
    else if (suffixType == ".") {
      return getLetterSuffix(lcType);
    }
    else {
      return getFullSuffix(lcType, value);
    }
  }
  
  function getLetterSuffix(lcType) {
    return locales[currentLocale].letter[lcType];
  }
                    
  function getFullSuffix(lcType, value) {
    var unit = locales[currentLocale];
    var pluralForm = unit.plural(value);
    return unit.full[lcType][pluralForm];
  }

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
    
    var unparsed = format;
    var result = "";
    while ( unparsed.length > 0 ) {
      // leave plain text untouched
      var textMatch = /^([^\\{]+)([\\{].*|)$/.exec(unparsed);
      if (textMatch) {
        result += textMatch[1];
        unparsed = textMatch[2];
      }
      
      // replace interval placeholder
      var match = /^([{].*?(?:[}]|$))(.*)$/i.exec(unparsed);
      if (match) {
        result += evalCode(match[1], t);
        unparsed = match[2];
      }

      // backslash escapes next character
      // transform \{ --> {
      // transform \\ --> \
      if (unparsed.charAt(0) === "\\") {
        result += unparsed.charAt(1);
        unparsed = unparsed.slice(2);
      }
    }
    
    return result;
  };
      
  var locales = {
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
        h: "t",
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
  };
  
  var currentLocale = "en_US";
  
  // Changing and getting current locale
  jintervals.locale = function(loc) {
    if (loc) {
      currentLocale = loc;
    }
    return currentLocale;
  };
  
  return jintervals;
})();


