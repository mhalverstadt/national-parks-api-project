$(document).ready(function () {
    $('#title').autocomplete({
        source: async function(request,response) {
            let data= await fetch(`http://localhost:8000/search?query=${request.term}`)
                    .then(results => results.json())
                    .then(results => results.map(result => {
                        return {
                            label: result.title,
                            value: result.title,
                            id: result._id
                        }
                    }))
                response(data)
                console.log(response)
        },
        minLength: 0,
        select: function(event, ui) {
            console.log(ui.item.id)
            fetch(`http://localhost:8000/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    console.log(result.image.url)
                    $('.info').css("display", "block")
                    $('#description').empty()
                        $("#description").append(`<p>${result.description}</p>`)
                    $('.visitors').empty()
                        $('.visitors').append(`<span>${result.visitors}</span>`)
                    $('.location').empty()
                        $('.location').append(`<span>${result.states[0].title}</span>`)
                    $('body').css("background-image", `url(${result.image.url})`);
                    // $('body').attr('background',result.image.url)
                    // $('img').attr('src',result.poster)
                })
        }
    })
})
