

    function zssBuildClsGridID( base, day, hour, min ) {
        var cellID = base + day;
        if ( hour < 10 ) {
            cellID = cellID + "0";
        }
        cellID = cellID + hour;
        if ( min < 10 ) {
            cellID = cellID + "0";
        }
        cellID = cellID + min;
        return cellID;
    }

    function zssCheckConflict(day, startHour, startMin, endHour, endMin, specialFlag ) {
        var conflictCount=0;
        var hLoop = 0;
        var baseCellID = 'zssclsgc';
        var colSpanCount = 1;
        if ( specialFlag == 0 ) {
           colSpanCount = 2;
        }
        for ( hLoop = startHour; hLoop <= endHour; hLoop++ ) {
            if ( hLoop == startHour ) {
                minuteLoopStart = startMin;
            } else {
                minuteLoopStart = 0;
            }
            if ( hLoop == endHour ) {
                minuteLoopEnd = endMin;
            } else {
                minuteLoopEnd = 45;
            }
            for ( mLoop = minuteLoopStart; mLoop <= minuteLoopEnd; mLoop+=15 ) {
                for ( cLoop = 1; cLoop <= colSpanCount; cLoop++ ) {
                    cellID = zssBuildClsGridID( baseCellID, day, hLoop, mLoop );
                    if ( specialFlag <= 1 ) {
                        if ( cLoop == 1 ) {
                            cellID = cellID + 'a';
                        } else {
                            cellID = cellID + 'b';
                        }
                    } else {
                        cellID = cellID + 'b';
                    }
                    var cell = document.getElementById(cellID);
 				    if (!cell) { continue; } 	/* %%1%% */
                    var curClass = cell.className;
                    if ( "zssclsschedconflict" == curClass.substring(0,19) ) {
                        conflictCount++;
                    }
                }
            }
        }
        return conflictCount;
    }

    function zssColourPartialConflict(day, startHour, startMin, endHour, endMin, specialFlag, colour ) {
        var hLoop = 0;
        var baseCellID = 'zssclsgc';
        var baseClass = "ZSSCLSSCHEDGC";
        var baseConflictClass = "zssclsschedconflict";
        var cellClass = "";
        var colSpanCount = 1;
        if ( specialFlag == 0 ) {
           colSpanCount = 2;
        }
        for ( hLoop = startHour; hLoop <= endHour; hLoop++ ) {
            if ( hLoop == startHour ) {
                minuteLoopStart = startMin;
            } else {
                minuteLoopStart = 0;
            }
            if ( hLoop == endHour ) {
                minuteLoopEnd = endMin;
            } else {
                minuteLoopEnd = 45;
            }
            for ( mLoop = minuteLoopStart; mLoop <= minuteLoopEnd; mLoop+=15 ) {
                for ( cLoop = 1; cLoop <= colSpanCount; cLoop++ ) {
                    // cellClass = baseClass;
                    cellClass = baseConflictClass;
                    if ( ( (mLoop+15) > minuteLoopEnd ) & ( hLoop == endHour ) ) {
                        cellClass = cellClass + "B";
                    }
                    cellID = zssBuildClsGridID( baseCellID, day, hLoop, mLoop );
                    switch( specialFlag ) {
                        case 0:
                            if ( cLoop == 1 ) {
                                cellID = cellID + 'a';
                            } else {
                                cellID = cellID + 'b';
                                 cellClass = cellClass + "T";
                            }
                            break;
                        case 1:
                            cellID = cellID + 'a';
                            cellClass = cellClass + "T";
                            break;
                        case 2:
                            cellID = cellID + 'b';
                           cellClass = cellClass + "T";
                            break;
                    }
                    var cell = document.getElementById(cellID);
                    var curClass = cell.className;
                    // if ( "zssclsschedconflict" != curClass.substring(0,19) ) {
                        cell.className = cellClass;
                        cell.height = 10;
                        cell.width = 50;
                        // cell.bgColor = colour;
                    // }
                }
            }
        }
    }

    function zssScheduleClass(days, startHour, startMin, endHour, endMin, specialFlag, colour, data) {
        var baseRowID = 'zssclsgr';
        var baseCellID = 'zssclsgc';
        var rowSpanCount = 0;
        var colSpanCount = 1;
        var lastColumnFlag = false;
        var conflictCount = 0;
        if ( endMin == 0 ) {
            endMin=59;
            endHour--;
        } else {
            endMin--;
        }
        if ( specialFlag == 0 ) {
           colSpanCount = 2;
        }
        if(document.getElementsByTagName) {
            for ( i = 0; i < days.length; i++ ) {
                if( days[i] > 0 ) {
                    var startCellID = zssBuildClsGridID( baseCellID, days[i], startHour, startMin );
                    if ( specialFlag <= 1 ) {
                        startCellID = startCellID + 'a';
                    } else {
                        startCellID = startCellID + 'b';
                    }
                    var hLoop = 0;
                    rowSpanCount = 0;
                    conflictCount=zssCheckConflict(days[i], startHour, startMin, endHour, endMin, specialFlag )
                    if ( conflictCount == 0 ) {
                        for ( hLoop = startHour; hLoop <= endHour; hLoop++ ) {
                            if ( hLoop == startHour ) {
                                minuteLoopStart = startMin;
                            } else {
                                minuteLoopStart = 0;
                            }
                            if ( hLoop == endHour ) {
                                minuteLoopEnd = endMin;
                            } else {
                                minuteLoopEnd = 45;
                            }
                            var startRowID =zssBuildClsGridID( baseRowID, '', hLoop, minuteLoopStart );
                            var startRow = document.getElementById(startRowID);
                            var rowIdx = startRow.rowIndex;
                            var maxColIdx = startRow.cells.length - 1;
                            for ( mLoop = minuteLoopStart; mLoop <= minuteLoopEnd; mLoop+=15 ) {
                                for ( cLoop = 1; cLoop <= colSpanCount; cLoop++ ) {
                                    cellID = zssBuildClsGridID( baseCellID, days[i], hLoop, mLoop );
                                    if ( specialFlag <= 1 ) {
                                        if ( cLoop == 1 ) {
                                            cellID = cellID + 'a';
                                        } else {
                                            cellID = cellID + 'b';
                                        }
                                    } else {
                                        cellID = cellID + 'b';
                                    }
                                    if ( cellID != startCellID ) {
                                        var cell = document.getElementById(cellID);
									
										if (!cell) { continue; } 	/* %%1%% */
                                        cellIdx= cell.cellIndex;
                                        if ( cellIdx == maxColIdx ) {
                                            lastColumnFlag = true;
                                        }
                                        document.getElementById("zssclasssched").rows[rowIdx].deleteCell( cellIdx );
                                    }
                                }
                                rowIdx++;
                                rowSpanCount++;
                            }
                        }
                        var cell = document.getElementById( startCellID );
                        cell.noWrap = false;
                        cell.rowSpan = rowSpanCount;
                        cell.colSpan = colSpanCount;
                        cell.className = "zssclsschedstdcls";
                        cell.innerHTML = data;
                        cell.bgColor = colour;
                        /*------------------------------------------------------------
                          The default height of each cell is 10px in the CSS, but
                          the cell.height will only return a 0 (zero) here as it
                          only reports on an explicitly defined height
                          (ie <td height="10px">) and not the height from the
                          stylesheet.
                        ------------------------------------------------------------*/
                        cell.height = ( 10 * rowSpanCount );
                        cell.width = ( 50 * colSpanCount );
                    } else {
                        zssColourPartialConflict(days[i], startHour, startMin, endHour, endMin, specialFlag, colour );
                    }
                }
            }
        }
    }

    function zssShowConflict( baseCellID, specialFlag, bottomFlag ) {
        var cellID = "";
        var cellSpanCount = 1;
        var cellLoop = 0;
        var baseConflictClass = "zssclsschedconflict";
        var cellClass = "";
        if ( specialFlag < 1 ) {
            cellSpanCount++;
        }
        for ( cellLoop = 0; cellLoop < cellSpanCount; cellLoop++ ) {
            if ( bottomFlag > 0 ) {
                cellClass = baseConflictClass + "b";
            } else {
                cellClass = baseConflictClass;
            }
            switch( specialFlag ) {
                case 0:
                    if ( cellLoop == 0 ) {
                        cellID = baseCellID + 'a';
                    } else {
                        cellID = baseCellID + 'b';
                        cellClass = cellClass + "t";
                    }
                    break;
                case 1:
                    cellID = baseCellID + 'a';
                    break;
                case 2:
                    cellID = baseCellID + 'b';
                    cellClass = cellClass + "t";
                    break;
            }
            var cell = document.getElementById(cellID);
            cell.className = cellClass;
            cell.height = 10;
            cell.width = 50;
        }
    }

    function zssSetDisplayByTag(strTag, strClassName, strDisplay) {
        var doc = document.getElementsByTagName(strTag);
        if( doc ) {
            for ( var iLoop = 0; iLoop < doc.length; iLoop++ ) {
                if( doc[iLoop].className==strClassName ) {
                    doc[iLoop].style.display=strDisplay;
                }
            }
        }
    }

    function zssSetDisplayByID(strID, strClassName, strDisplay) {
        var doc = document.getElementById(strID);
        if( doc ) {
            doc.style.display=strDisplay;
        }
    }

    function zssDelaySetDisplayByTag(strTag, strClassName, strDisplay, iDelay) {
        strCall="zssSetDisplayByTag('" + strTag + "', '" + strClassName + "', '" + strDisplay + "')";
        t=setTimeout( strCall, iDelay );
    }

