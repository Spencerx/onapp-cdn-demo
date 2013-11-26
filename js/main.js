$(function() {
    
    //Make the free trial alert box affix to the top bar
    $('#freetrial-alert-box').affix();
    // Update the navigation
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
    // FIXME: PRE: This is a bit hacky
    $('a[href="' + this.location.pathname + '"]').parent().parent().parent().addClass('active');

    $("[rel=tooltip]").tooltip();
    
    // sorter that defines what we need for currency ordering in Datatables
    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "currency-pre": function ( a ) {
            a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
            return parseFloat( a );
        },

        "currency-asc": function ( a, b ) {
            return a - b;
        },

        "currency-desc": function ( a, b ) {
            return b - a;
        }
    } );
    
    // make sure that anything with floatleft floats their double-parent over (for Forms)
    $(".clear").parent().parent().css('clear', 'both');
    $(".floatleft").parent().parent().css('float', 'left');
    $(".floatleftclear").parent().parent().css('float', 'left').css('clear', 'both');
    
});

/**
 * Priceplan contains all that is need to update sliders, graphs and maps on the
 * priceplan pages
 */
var Priceplan = function () {
    // Create the prepay amount chooser buttons
    $(Priceplan.prepaySizes).each(function (index, value) {
        $('#prepayButtons').append('<button class="btn prepay-btn" data-value="' + value + '" data-bonus="' + Priceplan.bonusSizes[index] + '">$' + value + '</button>');
    });

    // Create the estimated usage slider
    $("#usage .slider").slider({
        range: 'min',
        min: Priceplan.usageMinPosition,
        max: Priceplan.usageMaxPosition,
        step: 1,
        animate: true
    });

    // Bind slide events to update details when usage and prepay amounts change
    $(".prepay-btn").click(this.prepayAmountChange);

    $("#usage .slider").slider().bind('slidechange', this.usageSliderSlide);
    $("#usage .slider").slider().bind('slide', this.usageSliderSlide);

    // Update details when pops change
    $("table#locations input[type='checkbox']").click(function (e) {
        // Get the min price per GB and max price per GB
        Priceplan.calculateDays();
    });

    $('a#selectall').click(function() {
        $('input[name*=location]').prop('checked', true);
        Priceplan.calculateDays();
    });

    // Deselect all locations available
    $('a#selectnone').click(function() {
        $('input[name*=location]').prop('checked', false);
        Priceplan.calculateDays();
    });

    // Update sliders with form values
    $( "#usage .slider" ).slider( "option", "value", this.usageSliderPosition($("#usage [name='estimatedusage']").val()) );

    $(".prepay-btn[data-value='" + $("#prepay [name='prepayamount']").val() + "']").click();

};

// Prepay amounts for the slider
// Need to update form validation in PHP too if you change these values
Priceplan.prepaySizes = ["10", "25", "50", "100", "250", "500", "1000"];
// need to change these in SubscriptionController if you change them here
Priceplan.bonusSizes = ["0", "0", "0", "0", "20", "50", "100", "300", "600"];

Priceplan.prototype.prepayAmountChange = function(event) {

    // Display the warning message if the user has chosen a prepay amount less
    // than the amount that we recommend.
    if (Priceplan.recommenedPrepayAmount > $(this).data("value")) {
        $("#prepay .message").fadeIn();
    }
    else {
        $("#prepay .message").fadeOut();
    }

    $(".prepay-btn.btn-large").removeClass('btn-large');
    $("#prepay [name='prepayamount']").val($(this).data("value"));
    $(this).addClass('btn-large');

    $("#bonus-amount").html("Get $" + $(this).data("bonus") + " extra free!");
    if ($(this).data("bonus") == 0) {
        $("#bonus-amount").css('display', 'none');
    } else {
        $("#bonus-amount").css('display', 'block');
    }
    $("#bonus-amount").css("left", $(this).position().left + 1 + ($(this).outerWidth(true) / 2) - ($("#bonus-amount").outerWidth()/2));
    // Priceplan.calculateDays();
    return false;
};
// A multiplier used to convert data from usage to bytes
Priceplan.estimatedusagemultiplier = Math.pow(10, 9);

// Calculates the min and max days that the prepay amount will last
// and update the form
Priceplan.calculateDays = function () {
    var prices = $("table#locations input[type='checkbox']:checked").map(function() {
            return $(this).data("price");
        }).get();

    // Update the selected locations list
    $("table#locations input[type='checkbox']").each(function() {
        if ($(this).is(":checked")) {
            $("." + this.id).addClass("selected");
            $("." + this.id).fadeIn();
        }
        else {
            $("." + this.id).removeClass("selected");
            $("." + this.id).removeClass("selectedLastChild");
            $("." + this.id).fadeOut();
        }
    });

    // Update the commas and 'and' for the selected lists.
    var sectionsToHoldSelectedLocations = ["#locationsSection", "#selectedSection"];

    for (var i = 0; i < sectionsToHoldSelectedLocations.length; i++) {
        var section = sectionsToHoldSelectedLocations[i];
        var selected = $(section + " .selectedlocations .selected");
        var selectedCount = selected.length;
        selected.each(function (index) {
            if (selectedCount == 1) {
                $(this).removeClass("selectedLastChild");
                $(this).addClass("onlyLastChild");
            } else if (index < (selectedCount -1)) {
                $(this).removeClass("selectedLastChild");
                $(this).removeClass("onlyLastChild");
            }
            else {
                $(this).addClass("selectedLastChild");
                $(this).removeClass("onlyLastChild");
            }
        });
    }

    var numPrices = prices.length;
    if (prices == false) {
        prices = [0];
    }

    // var prepayAmount = $("#prepay [name='prepayamount']").val();
    var minPrice = Math.min.apply(Math, prices);
    var maxPrice = Math.max.apply(Math, prices);
    var sumPrices = prices.reduce(function(a, b) { return a + b; });
    var averagePrice = sumPrices / prices.length;
    var estimatedUsage = $("#usage [name='estimatedusage']").val();
    var usagePerDay = estimatedUsage * Priceplan.estimatedusagemultiplier / Math.pow(10, 9) / 30;

    var maxPricePerDay = usagePerDay * maxPrice;
    var minPricePerDay = usagePerDay * minPrice;
    var averagePricePerDay = usagePerDay * averagePrice;

    // var maxNumberOfDays =  prepayAmount / minPricePerDay;
    // var minNumberOfDays =  prepayAmount / maxPricePerDay;
    // var averageNumberOfDays =  prepayAmount / averagePricePerDay;

    var averageMonthlyCost = estimatedUsage * averagePrice;
    $("#selectedSection .averagemonthlycost").text("$" + averageMonthlyCost.toFixed(2));

    // Get the recommened monthly prepay amount.
    if (averagePrice) {
        for (i = 0; i < Priceplan.prepaySizes.length; i++) {
            if (Priceplan.prepaySizes[i] > averageMonthlyCost) {
                $("#selectedSection .prepayamount").text("$" + Priceplan.prepaySizes[i]);
                Priceplan.recommenedPrepayAmount = Priceplan.prepaySizes[i];
                $(".prepay-btn[data-value='" + Priceplan.prepaySizes[i] + "']").click();
                break;
            }
            if (i == Priceplan.prepaySizes.length -1) {
                $("#selectedSection .prepayamount").text("$" + Priceplan.prepaySizes[i]);
                Priceplan.recommenedPrepayAmount = Priceplan.prepaySizes[i];
                $(".prepay-btn[data-value='" + Priceplan.prepaySizes[i] + "']").click();
            }
        }
    }

    $("#numLocations").text(numPrices); // Used for priceplan edit

    var isStream = 0;
    if (numPrices < 3) {
         $('.buyButton').attr("data-content", "<div class='alert alert-error'>You must choose at least 3 locations.</div>");
         $('.buyButton').attr("disabled", true);
         $('.buyButton').popover('show');
    }
    else if( $("#hasLiveStream").val() == true ) {
        $("table#locations input[type='checkbox']:checked").map(function() {
            if($(this).attr("data-streamSupported") == 1) {
                isStream++;
            }
            });
        if (isStream < 2) {
            $('.buyButton').attr("data-content", "<div class='alert alert-error'>You have a live streaming resource defined, you need at least 2 live streaming locations</div>");
            $('.buyButton').attr("disabled", true);
            $('.buyButton').popover('show');
        }
        else {
            $('.buyButton').attr("disabled", false);
            $('.buyButton').popover('destroy');
        }
    }
    else {
        $('.buyButton').attr("disabled", false);
        $('.buyButton').popover('destroy');
    }
    // $("#maxDays").text(Math.round(maxPricePerDay * 10) / 10);
    // $("#averageDays").text(Math.round(averagePricePerDay * 10) / 10);
};

// Callback for the usage slider updates
Priceplan.prototype.usageSliderSlide = function(event, ui) {
    var bytes = Priceplan.usageSliderValue(ui.value);
    // alert(bytes);
    $(".estimatedusage").text(Priceplan.convertReadableBytes(bytes * Priceplan.estimatedusagemultiplier));
    $("#usage [name='estimatedusage']").val(bytes);
    Priceplan.calculateDays();
};

// Converts bytes to more readable form. e.g. 1000000 will become 1 MB
Priceplan.convertReadableBytes = function (size) {
    var sizename = [" Bytes", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];
    return size ? Math.round(size/Math.pow(1000, (i = Math.floor(Math.log(size) / Math.log(1000)))), 2) + sizename[i] : '0 Bytes';
};

// The minimum position of the usage slider
Priceplan.usageMinPosition = 0;
// The maximum position of the usage slider
Priceplan.usageMaxPosition = 200;
// The min log value of the usage slider
Priceplan.usageMinValue = Math.log(100);
// The max log value of the usage slider
Priceplan.usageMaxValue = Math.log(Math.pow(10, 6));
// The step increments of the usage slider
Priceplan.usageStep = (Priceplan.usageMaxValue - Priceplan.usageMinValue) / (Priceplan.usageMaxPosition - Priceplan.usageMinPosition);
Priceplan.recommenedPrepayAmount = 0;

// Converts the usage slider position to bytes / estimatedusagemultiplier
Priceplan.usageSliderValue = function (position) {
    return Math.round(Math.exp(Priceplan.usageMinValue + Priceplan.usageStep * (position - Priceplan.usageMinPosition)));
};

// Converts bytes / estimatedusagemultiplier to get the usage slider position
Priceplan.prototype.usageSliderPosition = function (value) {
   return (Math.log(value) - Priceplan.usageMinValue) / Priceplan.usageStep + Priceplan.usageMinPosition;
};
