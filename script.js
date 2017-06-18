window.addEventListener('load',function(){ 
    var cube = document.getElementsByClassName('cube')[0];
    var rotating = false;
    var numbers = new Array();
    var allThrows = new Array();
    var positionsY = {
        6:72,
        5:115,
        4:158,
        3:201,
        2:244,
        1:287
    };
    var positionsX = {
        1: 107,
        2: 164,
        3: 221,
        4: 278,
        5: 335,
        6: 392
    };
    var colors = {
        1: '#de6a6a',
        2: '#73de6a',
        3: '#bf6ade',
        4: '#6a6ade',
        5: '#6ad1de',
        6: '#dede6a'
    }
 
    
    var button = document.getElementsByClassName('throw')[0];
    button.addEventListener('click',function(e){
        if(!rotating)
        {
            rotating = true;
            button.style.cursor = 'not-allowed';
            var target = Math.ceil(Math.random()*6);
            var rotationX = Math.ceil(Math.random()*3) * 360;
            var rotationY = Math.ceil(Math.random()*3) * 360;
            var destinations = {
                1: {
                    direction: 'y',
                    amount: 0
                },
                2: {
                    direction: 'y',
                    amount: -90
                },
                3: {
                    direction: 'x',
                    amount:-90
                },
                4: {
                    direction: 'x',
                    amount:90
                },
                5: {
                    direction: 'y',
                    amount:90
                },
                6: {
                    direction: 'y',
                    amount:180
                }
            }
            destinations[target].direction=='y' ? rotationY+=destinations[target].amount : rotationX+=destinations[target].amount;
            cube.style.transform = 'rotateX(' + rotationX + 'deg) rotateY(' + rotationY + 'deg)';
            numbers.push(target);
            allThrows.push(target);
            setTimeout(function(){addPoint();columnChart();pieChart()},3000);
        }       
    });
    
    function count(number)
    {
        var count =0;
        for(i=0;i<allThrows.length;i++)
        {
            if(allThrows[i]==number)count++;
        }
        return count;
    }
    
    function chartYValues(mxV,mdV)
    {
        var values = '<text x="30" y="72" dy="3">'+mxV+'</text>';
        if(mdV)values+='<text x="30" y="201" dy="3">'+mdV+'</text>';
        document.getElementsByClassName('chart-y-values')[1].innerHTML = values;
    }
    
    function createColumn(value, column, maxValue, mediumValue)
    {
        var gap = 129,
            height=330;
        if(value>mediumValue)
        {
            height = (value-mediumValue)/(maxValue-mediumValue);
            height= 201-(gap*height);
        }
        else if(value>0)
        {
            height = value/mediumValue;
            height= 330-(gap*height);
        }
        column = '<rect x="'+(positionsX[column]-10)+'" y="'+height+'" width="20" height="'+(330-height)+'" fill="'+colors[column]+'"/>';
        return column;
    }
    
    function columnChart()
    {
        var values = {
            1: count(1),
            2: count(2),
            3: count(3),
            4: count(4),
            5: count(5),
            6: count(6)
        },
            maxValue=0,
            mediumValue=false,
            columns = '';
        for(i=1;i<=6;i++)
        {
            if(maxValue<values[i])maxValue=values[i];
        }
        
        if(maxValue!=1)mediumValue=Math.floor(maxValue/2);
        
        chartYValues(maxValue , mediumValue);
        
        for(i=1;i<=6;i++)
        {
            columns+= createColumn(values[i] , i, maxValue, mediumValue);
        }
        document.getElementsByClassName('rectangles')[0].innerHTML = columns;
    }
    
    function createPoint(y,width,x)
    {
        var point = '<circle cx="'+((width*x)+50)+'" cy="'+positionsY[y]+'" r="5"/>';
        return point;
    }
    
    function createLine(x1,x2,y1,y2)
    {        
        var line = '<line x1="'+parseInt(x1)+'" x2="'+parseInt(x2)+'" y1="'+positionsY[y1]+'" y2="'+positionsY[y2]+'"/>';
        return line;
    }
    
    function whichThrow(x,width)
    {
        var number = "<text x="+((width*x)+50)+" y='350'>"+(parseInt(x)+1)+"</text>";
        return number;
    }
    
    function addPoint()
    {
        button.style.cursor = 'pointer';
        rotating=false;
        if(numbers.length==21)numbers.shift();
        var breaks;
        numbers.length == 1 ? breaks = 400 : breaks = 400/(numbers.length-1);
        var points = '';
        var lines = '';
        var chartX = '';
        for(i=0;i<numbers.length;i++)
        {
            points+=createPoint(numbers[i] , breaks , i);
            chartX += whichThrow(i,breaks);
        }        
        document.getElementsByClassName('points')[0].innerHTML = points;
        document.getElementsByClassName('chart-x-values')[0].innerHTML = chartX;
        for(i=0;i<numbers.length-1;i++)
        {
            var circle = document.getElementsByClassName('points')[0].children;
            lines+=createLine(circle[i].getAttribute('cx')  , circle[i+1].getAttribute('cx'), numbers[i] , numbers[i+1]);
        }
        document.getElementsByClassName('lines')[0].innerHTML = lines;
    }
    
    function countPercentage(number)
    {
        return ((count(number)/allThrows.length));
    }
    
    function calcPieElement(which,a,aP)
    {
        var l=100;
        var aRad = a * Math.PI / 180;
        var element = '';
        
        var z = Math.sqrt( 2*l*l - ( 2*l*l*Math.cos(aRad) ) ),x,y;
        if( a <= 90 ) {
            x = l*Math.sin(aRad);
        }
        else 
        {
            x = l*Math.sin((180 - a) * Math.PI/180 );
        }
        y = Math.sqrt( z*z - x*x );
        x = l + x;
        
        
        x+=100;
        y+=100;

        element += `<path d="M200,200  L200,100 A100,100  1 0,1 ${x} ,  ${y} z" fill="${colors[which]}" transform="rotate(${aP},200,200)"/>`;
        return element;
    }
    
    function createPieElement(which,eP,aP)
    {
        var element='';
        if(eP!=0.00)
        {
            var a = Math.ceil(360 * eP);
            if( a > 180 )
            {
                element+=calcPieElement(which,180,aP);
                a-=180;
                aP+=180;
                eP-=0.5;
                element+=calcPieElement(which,a,aP);
            }
            else
            {
                element+=calcPieElement(which,a,aP);
            }            

            aP+=eP*360;
        }
        
        
        return [element,aP];
    }
    
    function pieChart()
    {
        var percentages = {
            1: countPercentage(1),
            2: countPercentage(2),
            3: countPercentage(3),
            4: countPercentage(4),
            5: countPercentage(5),
            6: countPercentage(6)
        },
        actualPercentage =0,
        pieElements='';
        
        for(i=1;i<=6;i++)
        {
            var [pieElement,percentage] = createPieElement(i,percentages[i],parseInt(actualPercentage));
            pieElements+=pieElement;
            actualPercentage=percentage;
        }
        document.getElementsByClassName('pie-elements')[0].innerHTML = pieElements;
    }
});

        
