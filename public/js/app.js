// app.js
$(function() {


            var baseMaxEventId = 1000;

            var updateServer = function(eventUpdated) {
                $.ajax({
                        url: '/events',
                        type: 'PUT',
                        dataType: 'json',
                        data: eventUpdated
                    })
                    .done(function(response) {
                        console.log("updateServer success");
                        console.log(response);
                    })
                    .fail(function() {
                        console.log("updateServer error");
                        console.log(xhr);
                    })
                    .always(function() {
                        console.log("updateServer complete");
                    });
            };

            var getConfig = function() {
                $.ajax({
                        url: '/config/1',
                        type: 'GET',
                        dataType: 'json',
                    })
                    .done(function(configData) {
                        console.log("config success");
                        baseMaxEventId = configData.baseMaxEventId;
                    })
                    .fail(function() {
                        console.log("config error");
                        console.log(xhr);
                    })
                    .always(function() {
                        console.log("config complete");
                    });
            };

            var postConfig = function(data){
              $.ajax({
                url: '/config/1',
                type: 'POST',
                dataType: 'json',
                data: data,
              })
              .done(function() {
                console.log("postConfig success");
              })
              .fail(function() {
                console.log("postConfig error");
              })
              .always(function() {
                console.log("postConfig complete");
              });

            };

            var resourcesObj = {
                url: '/resources',
                type: 'GET',
                error: function() {
                    $('#script-warning').show();
                }
            };

            var eventsPostObj = function(data){
            $.ajax({
                            url: '/events',
                            type: 'POST',
                            dataType: 'json',
                            data: data,
                          })
                          .done(function() {
                            console.log("eventsPostObj success");
                          })
                          .fail(function() {
                            console.log("eventsPostObj error");
                          })
                          .always(function() {
                            console.log("eventsPostObj complete");
                          });

            }

            var eventsGetFunction = function(start, end, callback) {
                $.ajax({
                        url: '/events',
                        type: 'GET',
                        dataType: 'json)',
                        data: {
                            start: start.unix(),
                            end: end.unix()
                        },
                    })
                    .done(function(data) {
                        var events = [];
                        $(data).each(function() {
                            events.push({
                                id: $(this).attr('id'),
                                resourceId: $(this).attr('resourceId'),
                                resourceIds: $(this).attr('resourceIds'),
                                start: moment.unix($(this).attr('start')).format("YYYY-MM-DDTHH:mm:ss"),
                                end: moment.unix($(this).attr('end')).format("YYYY-MM-DDTHH:mm:ss"),
                                title: $(this).attr('title')
                            });
                        });
                        $('#calendar').fullCalendar('renderEvents', events, true); //or data?
                        console.log("eventsGetFunction success");
                    })
                    .then(callback(events))
                    .fail(function() {
                        $('#script-warning').show();
                        console.log("eventsGetFunction error");
                    })
                    .always(function() {
                        console.log("eventsGetFunction complete");
                    });

            };

            var eventRenderFunction = function(eventData, element) { element.css("font-weight:bold"); };

            var eventDropFunction = function(eventData, delta, revertFunc) {
                alert(eventData.title + " was dropped on " + eventData.start.format());
                if (!confirm("Are you sure about this change?")) {
                    revertFunc();
                } else {
                    $('#calendar').fullCalendar('updateEvent', eventData);
                    var eventUpdated = {
                        id: eventData.id,
                        resourceId: eventData.resourceId,
                        start: eventData.start.unix(),
                        end: eventData.end.unix(),
                        title: eventData.title
                    };
                    updateServer(eventUpdated);
                }
            };

            var eventResizeStopFunction = function(eventData, jsEvent, ui, view) {
                alert(eventData.title + " was resized to " + eventData.end.format());
                if (!confirm("Are you sure about this change?")) {
                    revertFunc();
                } else {
                    $('#calendar').fullCalendar('updateEvent', eventData);
                    var eventUpdated = {
                        id: eventData.id,
                        resourceId: eventData.resourceId,
                        start: eventData.start.unix(),
                        end: eventData.end.unix(),
                        title: eventData.title
                    };
                    updateServer(eventUpdated);
                }
            };

            var selectFunction = function(start, end, jsEvent, view, resource) {
                var title = prompt('Event Title:');
                var selectedEventData = {};
                if (title) {
                    selectedEventData = {
                        id: JSON.parse(baseMaxEventId) + 10,
                        resourceId: resource.id,
                        start: start.unix(),
                        end: end.unix(),
                        title: title
                    };
                    baseMaxEventId = JSON.parse(selectedEventData.id) + 1;
                    $('#calendar').fullCalendar('renderEvent', selectedEventData, true); // stick? = true
                    eventsPostObj(selectedEventData);
                    var baseMaxEventIdObj = {
                        "id": "1",
                        "baseMaxEventId": baseMaxEventId
                    };
                    postConfig(baseMaxEventIdObj);
                    $('#calendar').fullCalendar('getResources');
                  };
                  $('#calendar').fullCalendar('unselect');
                };


                // fulcalendar chiamata principale

                $('#calendar').fullCalendar({
                    //local configuration section
                    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                    locale: 'it',
                    weekends: false,
                    businessHours: [{
                        dow: [1, 2, 3, 4, 5], // Monday - Thursday
                        start: '9:00',
                        end: '13:00'
                    }, {
                        dow: [1, 2, 3, 4, 5],
                        start: '14:00',
                        end: '18:00'
                    }],
                    minTime: "09:00:00",
                    maxTime: "18:00:00",
                    now: moment(),
                    navLinks: true, // can click day/week names to navigate views
                    editable: true, // enable draggable events
                    selectable: true,
                    selectHelper: true,
                    aspectRatio: 3,
                    height: $(window).height() * 0.92,
                    header: {
                        left: 'today prev,next',
                        center: 'title',
                        right: 'timelineDay,timelineThreeDays,timelineFiveDays,timeline31Days,agendaWeek,month'
                    },
                    defaultView: 'timeline31Days',
                    views: {
                        timelineThreeDays: {
                            type: 'timeline',
                            duration: {
                                days: 3
                            }
                        },
                        timelineFiveDays: {
                            type: 'timeline',
                            duration: {
                                days: 5
                            }
                        },
                        timeline31Days: {
                            type: 'timeline',
                            duration: {
                                days: 31
                            }
                        }
                    },
                    resourceLabelText: 'Risorse',
                    resources: resourcesObj,
                    events: eventsGetFunction(),
                    eventRender: eventRenderFunction(),
                    eventDrop: eventDropFunction(),
                    eventResizeStop: eventResizeStopFunction(),
                    select: selectFunction()
                })







            })
