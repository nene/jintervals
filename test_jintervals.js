/**
 * Copyright (c) 2009 Rene Saarsoo
 *
 * This file is part of jintervals.
 *
 * jintervals is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * jintervals is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with jintervals. If not, see <http://www.gnu.org/licenses/>.
 * 
 */

// helper function for testing
function interval(time, format) {
  var                    d=1,    h=2,   m=3,   s=4;
  var t = time.match(/^(\d\d\d) (\d\d):(\d\d):(\d\d)$/);
  var seconds = t[s]*1 + t[m]*60 + t[h]*60*60 + t[d]*60*60*24;
  return jintervals(seconds, format);
}

module("jintervals");

test("{s}", function() {
  equals(interval("000 00:00:00", "{s}"), "0");
  equals(interval("000 00:00:01", "{s}"), "1");
  equals(interval("000 00:00:15", "{s}"), "15");
  equals(interval("000 00:00:59", "{s}"), "59");
  equals(interval("000 00:01:00", "{s}"), "0");
  equals(interval("000 00:01:15", "{s}"), "15");
});

test("{S}", function() {
  equals(interval("000 00:00:00", "{S}"), "0");
  equals(interval("000 00:00:59", "{S}"), "59");
  equals(interval("000 00:01:00", "{S}"), "60");
  equals(interval("000 00:01:15", "{S}"), "75");
});

test("{m}", function() {
  equals(interval("000 00:00:00", "{m}"), "0");
  equals(interval("000 00:00:59", "{m}"), "0");
  equals(interval("000 00:01:00", "{m}"), "1");
  equals(interval("000 00:01:01", "{m}"), "1");
  equals(interval("000 00:01:59", "{m}"), "1");
  equals(interval("000 00:02:00", "{m}"), "2");
  equals(interval("000 00:59:59", "{m}"), "59");
  equals(interval("000 01:00:00", "{m}"), "0");
  equals(interval("000 01:15:00", "{m}"), "15");
  equals(interval("000 01:00:15", "{m}"), "0");
});

test("{M}", function() {
  equals(interval("000 00:00:59", "{M}"), "0");
  equals(interval("000 00:59:00", "{M}"), "59");
  equals(interval("000 01:00:00", "{M}"), "60");
  equals(interval("000 01:15:00", "{M}"), "75");
});

test("{h}", function() {
  equals(interval("000 00:00:00", "{h}"), "0");
  equals(interval("000 00:59:59", "{h}"), "0");
  equals(interval("000 01:00:00", "{h}"), "1");
  equals(interval("000 01:01:00", "{h}"), "1");
  equals(interval("000 01:59:59", "{h}"), "1");
  equals(interval("000 02:00:00", "{h}"), "2");
  equals(interval("000 23:59:59", "{h}"), "23");
  equals(interval("001 00:00:00", "{h}"), "0");
  equals(interval("001 15:00:00", "{h}"), "15");
  equals(interval("001 00:15:00", "{h}"), "0");
});

test("{H}", function() {
  equals(interval("000 00:59:59", "{H}"), "0");
  equals(interval("000 23:59:59", "{H}"), "23");
  equals(interval("001 00:00:00", "{H}"), "24");
  equals(interval("001 12:00:00", "{H}"), "36");
});

test("{d}", function() {
  equals(interval("000 00:00:00", "{d}"), "0");
  equals(interval("000 23:59:59", "{d}"), "0");
  equals(interval("001 00:00:00", "{d}"), "1");
  equals(interval("001 01:00:00", "{d}"), "1");
  equals(interval("001 23:59:59", "{d}"), "1");
  equals(interval("002 00:00:00", "{d}"), "2");
  equals(interval("365 00:00:00", "{d}"), "365");
});

test("{D}", function() {
  equals(interval("000 23:59:59", "{D}"), "0");
  equals(interval("001 00:00:00", "{D}"), "1");
  equals(interval("999 00:00:00", "{D}"), "999");
});

test("nr of decimal places", function() {
  equals("|"+interval("001 00:00:00", "{dd}"), "|01");
  equals("|"+interval("011 00:00:00", "{dd}"), "|11");
  equals("|"+interval("111 00:00:00", "{dd}"), "|111");
  
  equals("|"+interval("001 00:00:00", "{ddd}"), "|001");
  equals("|"+interval("011 00:00:00", "{ddd}"), "|011");
  equals("|"+interval("111 00:00:00", "{ddd}"), "|111");
  
  equals("|"+interval("111 00:00:00", "{dddddd}"), "|000111");
});

test("unit abbrevations", function() {
  equals(interval("000 00:00:01", "{s.}"), "1s");
  equals(interval("000 00:02:00", "{m.}"), "2m");
  equals(interval("000 03:00:00", "{h.}"), "3h");
  equals(interval("004 00:00:00", "{d.}"), "4d");
});

test("unit names", function() {
  equals(interval("000 00:00:00", "{seconds}"), "0 seconds");
  equals(interval("000 00:00:00", "{minutes}"), "0 minutes");
  equals(interval("000 00:00:00", "{hours}"), "0 hours");
  equals(interval("000 00:00:00", "{days}"), "0 days");
  
  equals(interval("000 00:00:01", "{seconds}"), "1 second");
  equals(interval("000 00:01:00", "{minutes}"), "1 minute");
  equals(interval("000 01:00:00", "{hours}"), "1 hour");
  equals(interval("001 00:00:00", "{days}"), "1 day");
  
  equals(interval("000 00:00:02", "{seconds}"), "2 seconds");
  equals(interval("000 00:02:00", "{minutes}"), "2 minutes");
  equals(interval("000 02:00:00", "{hours}"), "2 hours");
  equals(interval("002 00:00:00", "{days}"), "2 days");
});

test("optionality modifier", function() {
  equals(interval("000 00:00:00", "{h?}"), "");
  equals(interval("000 00:12:00", "{h?}"), "");
  equals(interval("000 05:00:00", "{h?}"), "5");
  equals(interval("001 00:00:00", "{h?}"), "0");
  // optional suffix
  equals(interval("000 01:00:00", "{h? ...}"), "1 ...");
  equals(interval("000 00:00:00", "{h? ...}"), "");
  equals(interval("001 00:00:00", "{h? ...}"), "0 ...");
});

test("escaping", function() {
  equals(interval("000 00:00:00", "\\{S}"), "{S}");
  equals(interval("000 00:00:00", "x\\\\y"), "x\\y");
  // disappearing backslash
  equals(interval("000 00:00:00", "\\{S\\}"), "{S}");
  equals(interval("000 00:00:00", "\\x"), "x");
  equals(interval("000 00:00:00", "\\"), "");
});

test("error handling", function() {
  equals(interval("000 00:00:00", "M}"), "M}");
  equals(interval("000 00:00:00", "{M"), "?");
  equals(interval("000 00:00:00", "{x}"), "?");
  equals(interval("000 00:00:00", "{Sokund}"), "?");
  equals(interval("000 00:00:00", "{S }"), "?");
  equals(interval("000 00:00:00", "{S..}"), "?");
});

test("combinations", function() {
  equals(interval("000 00:00:00", "hello"), "hello");
  equals(interval("000 00:00:15", "{S} seconds"), "15 seconds");
  equals(interval("000 00:05:15", "{M} minutes and {s} seconds"), "5 minutes and 15 seconds");
  equals(interval("000 00:00:15", "{S} seconds, I repeat: {S}"), "15 seconds, I repeat: 15");
  equals(interval("000 00:01:15", "{Minutes?} and {seconds}"), "1 minute and 15 seconds");
  equals(interval("000 00:00:15", "{Minutes?} and {seconds}"), " and 15 seconds");
  equals(interval("007 00:00:15", "\\{DDays} => {DDays}"), "{DDays} => 07 days");
  equals(interval("000 10:04:00", "{H.}, {m.}"), "10h, 4m");
  equals(interval("012 22:06:17", "{Days} {hh}:{mm}:{ss}"), "12 days 22:06:17");
  
  equals(interval("000 05:12:00", "{Hours? and }{minutes}"), "5 hours and 12 minutes");
  equals(interval("000 00:12:00", "{Hours? and }{minutes}"), "12 minutes");
  
  equals(interval("000 05:12:00", "{HH?:}{mm}"), "05:12");
  equals(interval("000 00:12:00", "{HH?:}{mm}"), "12");
  
  equals(interval("000 05:12:00", "{hours} and {minutes"), "5 hours and ?");
});

test("localization", function() {
  equals(jintervals.locale(), "en_US");
  equals(jintervals.locale("et_EE"), "et_EE");
  equals(jintervals.locale(), "et_EE");
  equals(jintervals.locale("en_US"), "en_US");
});

test("estonian locale", function() {
  jintervals.locale("et_EE");
  equals(interval("000 00:00:05", "{s.}"), "5s");
  equals(interval("000 00:00:01", "{seconds}"), "1 sekund");
  equals(interval("000 00:00:05", "{seconds}"), "5 sekundit");
  
  equals(interval("000 00:05:00", "{m.}"), "5m");
  equals(interval("000 00:01:00", "{minutes}"), "1 minut");
  equals(interval("000 00:05:00", "{minutes}"), "5 minutit");
  
  equals(interval("000 05:00:00", "{h.}"), "5t");
  equals(interval("000 01:00:00", "{hours}"), "1 tund");
  equals(interval("000 05:00:00", "{hours}"), "5 tundi");
  
  equals(interval("005 00:00:00", "{d.}"), "5p");
  equals(interval("001 00:00:00", "{days}"), "1 p\u00E4ev");
  equals(interval("005 00:00:00", "{days}"), "5 p\u00E4eva");
  jintervals.locale("en_US");
});


