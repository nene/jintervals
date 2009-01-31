/**
 * jintervals -- JavaScript intervals
 * 
 * {Y} -- nr of years (0...)
 * {D} -- nr of days (0...)
 * {H} -- nr of hours (0...)
 * {M} -- nr of minutes (0...)
 * {S} -- nr of seconds (0...)
 * 
 * {y} -- nr of years (0...)
 * {d} -- nr of days (0..365)
 * {h} -- nr of hours (0..23)
 * {m} -- nr of minutes (0..59)
 * {s} -- nr of seconds (0..59)
 * 
 * {hh} -- nr of hours (00..23)
 * {mm} -- nr of minutes (00..59)
 * {ss} -- nr of seconds (00..59)
 * 
 * {y.} -- nr of years (0y...)
 * {d.} -- nr of days (0d..365d)
 * {h.} -- nr of hours (0h..23h)
 * {m.} -- nr of minutes (0m..59m)
 * {s.} -- nr of seconds (0s..59s)
 * 
 * {years} -- nr of years (0 years ...)
 * {days} -- nr of days (0 days .. 365 days)
 * {hours} -- nr of hours (0 hours .. 23 hours)
 * {minutes} -- nr of minutes (0 minutes .. 59 minutes)
 * {seconds} -- nr of seconds (0 seconds .. 59 seconds)
 * 
 * Modifiers:
 * 
 * ? - display item only when greater than zero.
 * 
 * You should start a scentence with an uppercase letter.  This is right:
 * 
 *   interval(60*90+15, "{Minutes} {seconds}") --> "90 minutes 15 seconds"
 * 
 * But this is wrong:
 * 
 *   interval(60*90+15, "{minutes} {Seconds}") --> "30 minutes 5415 seconds"
 *
 * Ultimate example:
 * 
 *   {HHours?}
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
  
  var suffixes = {
    d: ["d", " day", " days"],
    h: ["h", " hour", " hours"],
    m: ["m", " minute", " minutes"],
    s: ["s", " second", " seconds"]
  };
  
  function getSuffix(suffixType, type, value) {
    var lcType = type.toLowerCase();
    
    if (suffixType == "") {
      return "";
    }
    else if (suffixType == ".") {
      return suffixes[lcType][0];
    }
    else {
      return (value == 1) ? suffixes[lcType][1] : suffixes[lcType][2];
    }
  }

  return function(seconds, format) {
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
})();


