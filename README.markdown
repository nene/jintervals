jintervals - formatting time intervals
======================================

**jintervals** is inspired by well-known date and time formatting
functions, but is specific to intervals.  It takes interval in seconds
and produces string according to specified format.

jintervals is a **stand-alone** library, not dependant of any
JavaScript library.  Only the development testsuite uses jQuery and
QUnit.

jintervals is **localized**.  It currently supports English, Russian,
Ukrainian, Lithuanian, Finnish and Estonian, plus you can easily add
your own.

jintervals is cross-licensed under MIT and LGPL.


## Examples

Specifying number of decimal places:

    jintervals(65, "{MM}:{ss}"); --> 01:05

Hiding of zero values:

    jintervals(88, "{M?:}{s}"); --> 1:28
    jintervals(28, "{M?:}{s}"); --> 28

Full and abbreviated unit names:

    jintervals(75, "{Minutes} and {s.}"); --> 1 minute and 15s
