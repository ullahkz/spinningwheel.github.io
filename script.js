document.addEventListener("DOMContentLoaded", function () {
  var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    //color = d3.scale.category20c();//category20c()
    // color = [
    //     "#B7E4C7",
    //     "#F6CED8",
    //     "#FFDAB9",
    //     "#87CEEB",
    //     "#E6E6FA",
    //     "#FFFACD",
    //     "#FF6F61",
    //     "#C8A2C8",
    //     "#8FBC8F"
    //   ];

    // color = [
    //   "#FFD700", // Gold
    //   "#FFA07A", // Light Salmon
    //   "#FF7F50", // Coral
    //   "#00FA9A", // Medium Spring Green
    //   "#87CEFA", // Light Sky Blue
    //   "#4682B4", // Steel Blue
    //   "#708090", // Slate Gray
    //   "#B0C4DE", // Light Steel Blue
    //   "#6495ED", // Cornflower Blue
    // ];
    // autumn colors
    color = [
      "#FF8C00", // Dark Orange
      "#FF4500", // Orange Red
      "#D2691E", // Chocolate
      "#8B4513", // Saddle Brown
      "#CD853F", // Peru
      "#A0522D", // Sienna
      "#DEB887", // Burly Wood
      "#F4A460", // Sandy Brown
      "#FF6347", // Tomato
      "#B22222", // Firebrick
      "#DAA520", // Goldenrod
      "#FFD700", // Gold
      "#8B0000", // Dark Red
      "#FFB6C1", // Light Pink (for softer autumn tones)
      "#808000", // Olive
      "#556B2F", // Dark Olive Green
    ];
  //randomNumbers = getRandomNumbers();
  var data = [
    {
      label: "Michael",
      value: 1,
      question: "<span>Today's Daily-Hero is<br/>Michael!</span>",
    },
    {
      label: "Felicia",
      value: 2,
      question: "<span>Today's Daily-Hero is<br/>Felicia!</span>",
    },
    {
      label: "Sandra",
      value: 3,
      question: "<span>Today's Daily-Hero is<br/>Sandra!</span>",
    },
    {
      label: "Franziska",
      value: 4,
      question: "<span>Today's Daily-Hero is<br/>Franziska!</span>",
    },
    {
      label: "Kazi",
      value: 5,
      question: "<span>Today's Daily-Hero is<br/>Kazi!</span>",
    },
    {
      label: "Nils",
      value: 6,
      question: "<span>Today's Daily-Hero is<br/>Nils!</span>",
    },
    {
      label: "Thorlef",
      value: 7,
      question: "<span>Today's Daily-Hero is<br/>Thorlef!</span>",
    },
    {
      label: "Lukas",
      value: 8,
      question: "<span>Today's Daily-Hero is<br/>Lukas!</span>",
    },
    {
      label: "Joachim",
      value: 8,
      question: "<span>Today's Daily-Hero is<br/>Joachim!</span>",
    },
  ];
  var svg = d3
    .select("#chart")
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
  var container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
      "transform",
      "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
    );
  var vis = container.append("g");

  var pie = d3.layout
    .pie()
    .sort(null)
    .value(function (d) {
      return 1;
    });
  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(r);
  // select paths, use arc generator to draw
  var arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs
    .append("path")
    .attr("fill", function (d, i) {
      return color[i];
    })
    .attr("d", function (d) {
      return arc(d);
    });
  // add the text
  arcs
    .append("text")
    .attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return (
        "rotate(" +
        ((d.angle * 180) / Math.PI - 90) +
        ")translate(" +
        (d.outerRadius - 10) +
        ")"
      );
    })
    .attr("text-anchor", "end")
    .text(function (d, i) {
      return data[i].label;
    })
    .classed("animate__animated animate__zoomInDown", true);
  container.on("click", spin);

  function spin(d) {
    container.on("click", null);
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if (oldpick.length == data.length) {
      console.log("done");
      container.on("click", null);
      return;
    }
    var ps = 360 / data.length,
      pieslice = Math.round(1440 / data.length),
      rng = Math.floor(Math.random() * 1440 + 360);

    rotation = Math.round(rng / ps) * ps;

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;
    if (oldpick.indexOf(picked) !== -1) {
      d3.select(this).call(spin);
      return;
    } else {
      oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps / 2);
    vis
      .transition()
      .duration(5000)
      .attrTween("transform", rotTween)
      .each("end", function () {
        //mark question as seen
        d3.select(".slice:nth-child(" + (picked + 1) + ") path").attr(
          "fill",
          "#fff"
        );
        d3.select(".slice:nth-child(" + (picked + 1) + ") text")
          .transition()
          .duration(1000)
          .style("fill", "rgb(255,255,255)")
          .transition()
          .duration(1000)
          .style("fill", "rgb(0,0,0)");

        //populate question
        oldrotation = rotation;
        const content = document.getElementById("question-container");
        if (content) {
          content.style.visibility = "visible";
          if (content.classList.contains("animate__animated")) {
            content.className = "";
            setTimeout(() => {
              content.classList.add("animate__animated", "animate__flipInX");
            }, 25);
          } else {
            content.classList.add("animate__animated", "animate__zoomInDown");
          }
        }
        setTimeout(() => {
          d3.select("#question h1").html(data[picked].question);
        }, 50);
        /* Get the result value from object "data" */
        console.log(data[picked].value);

        /* Comment the below line for restrict spin to sngle time */
        container.on("click", spin);
      });
  }
  //make arrow
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (w + padding.left + padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style({ fill: "black" });
  //draw spin circle
  container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({ fill: "#DAA520", cursor: "pointer" });
  //spin text
  container
    .append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "30px" });

  function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
      return "rotate(" + i(t) + ")";
    };
  }

  function getRandomNumbers() {
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if (
      window.hasOwnProperty("crypto") &&
      typeof window.crypto.getRandomValues === "function"
    ) {
      window.crypto.getRandomValues(array);
      console.log("works");
    } else {
      //no support for crypto, get crappy random numbers
      for (var i = 0; i < 1000; i++) {
        array[i] = Math.floor(Math.random() * 100000) + 1;
      }
    }
    return array;
  }
});
