"use strict";
(() => {
var exports = {};
exports.id = 7155;
exports.ids = [7155];
exports.modules = {

/***/ 14021:
/***/ ((module) => {

module.exports = import("next/dist/compiled/@vercel/og/index.node.js");;

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 50612:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&isDynamic=0!./app/favicon.ico?__next_metadata_route__
var favicon_next_metadata_route_namespaceObject = {};
__webpack_require__.r(favicon_next_metadata_route_namespaceObject);
__webpack_require__.d(favicon_next_metadata_route_namespaceObject, {
  GET: () => (GET),
  dynamic: () => (dynamic)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(19513);
// EXTERNAL MODULE: ./node_modules/next/server.js
var server = __webpack_require__(20514);
;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&isDynamic=0!./app/favicon.ico?__next_metadata_route__


const contentType = "image/x-icon"
const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAI0AAACUCAYAAACuh6r2AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAdhklEQVR4Xu1dCXyURZZPnwlJd9I5IQnIIXiAAioiEFAURrlU9Ofq6Lijg8fqzKyr47E7qDteM67jeOzqjOu4OK7XjusxI8MhIsitIHIKiCiiQEJCSDok6Ryd7t73/7q/7o8m3VVffdXpDvsVv/516O/Vq1evXr169d6r+rKyzGJywOSAyQGTAyYHTA6YHDA5YHLA5IDJAZMDJgdMDpgcMDlgcsDkgMkBkwMmB0wOmBwwOWBywOSAyQGTAyYHTA6YHDA5YHLA5IDJAZMDJgdMDpgcMDmQwRywZCBt8TTpoTFE/cHnRCrd9V8vT8APaXzR07jugSid+OoMqnQLfWbzVebqlwoUT3sgKxRsoXYC9GmsX/+zkaEun4+vXTlQ1uzi4sJRD66IYHNYHZ7+kcFy0LeNPqBZpVv7d7cExLiRkC/aSdIdvq5QoOMoIS9q+Pze0pC/uV5GT+0ykMTjIGEpod9+TJ8b6XOmwTaCEUFQGQTmWCMfreBgUAroA8YU0iclfWP0xR8RDggJaMiLCI3MydlFOPFBW5gg4A8KeKIKDn7DB/9vok925G+DQxGuLoWxJRPm9bNYHfsIH2Z6HX089MEA5kqgUhUQXlQQru/AJIs9103appm3ohE40jLoK/h5gD5lkb5zqU4d7UJQOiKfTvqG0KCAR2gbwoq/8TvaxkSCgGFMVOHS0Vz3oIZnwMDr2xXGWG0Q5swpvgMLsDTl1i2/whkKdYHZKS1FY363nhpoKBhx97SUNqQTedCP1Skra/+7g8uDHQ2HdFbvFtyophkog4gU4YDQgGOyZ3sicrEsZtbMOZZSafadEaGBloKKzMiSWzkDdlWW+/R/fATfR3c+MzcVhLqH3fQkJnLBiF/A6P9/UbD+iRbMYMPLm2jjOurlEGyrDni9oEeoQrHeSmmANzLWx5BrRNMAEYyyzCyWMI+Kxzx1l0Jo/fqFHXXrtsgk1pE/zFM4+tHHwzgzfv5IExqjiNpkDkKKcVmzyyYMltUGCQykJOUGtix6ZeIxKjTSjCuZnUqAqx/9XkiCM9xoWyQw7siS1Ncort5Y3+jyRM4QDrkLqe4Echq01bL5FOLb8FidGDva7jvyE+O0hJeN0kmvL1SBahZXlQZ8NcLe0bLJ74b3sVRsueXM/gS7wnMr2AHzh6ew+291wg0WLlZH7O8k2KX5aThGnKeTvQ7GQYOdRNIS9Mdiy3jDpSeExrCmybLA6Zi8qDMNUIeWXjyMvjx+747N9K2GBthTq5smbH36wvOa3e8Hy77HY2fhiISEOFwxc6Zk3AtwxPWrXT7byaJd+7yk6uVG+v+XzkK+yEiw/bBSvWbpJWfTV2dnw+YdHO0lCtgqIQKrs7AUuCov3RzVlMk1TTTU1as1DXoBfa3GTYQEBswPtNXCPS6yg8NkQV29ZT9V0K+hwpOjhrMx7UTC32ocCfxCSIAZ6EzQjjShMaxpOo5sVGjMKRmbkCdWR9j2QCmpmvcVfTXVLBzn4WRiUjAIzuF1cyYSkKP84o8/VoGtjsRhr9wBlyuGSMGIe/+Nvuqbdjz5u0SN5J40G4bzEPr4XUN+dAaTZo09dmTDXf+AgSYNs4VZjw/AWjT22RUE2mF38TnjiT8K5pC/RdpON102TYHFmm1YYDV8hiCKGLZYnk5jjNdJ9BzhAS5rMw4XgqXs9ZtPYFQozMDYzkJfXSnQ6RIaEK/LnmD0FtsSESGs4BgA4O1DHyUsIVBgB8ko6lhBYETGTVpczPBuwFk85nzqRFv59FUbVM5YbeBx8nJ013OrCKL5yIY7ZrFgeZ+7hs75EcEih8VTWjXvCVa9UFe7AnJo+SxEpr+kT117zbKoGre7Ty6pnPV52JrFSGm2uYlwN+14eik9g/1ib9h4N+gxXNyn3PpLQoJQxeGS8S9iSU1aQl2xlahm2fQLCbil49DKsB0hoYhIbHyza+gHEWMUg1uJsZDQDxUFGIOZHfWjcOLG7MWggB6lkMCI5gIhp2iAAA2JSMXEhhGLpY49G4/HAl5gQkgrhjWNSon7lFsepL8xK20l4//4PC+FdSt/+AuCRVBxR+u+t+bz1mPBlU1+r4Fg2vIGXoElKGnxN3+jPu849OFU2Dj1pZPeBKOzc8rGcy1LbbUr0Pfcuo//Dp7njmBHveEQg7P4HGzVbeWXrIhpcYeL1Z0s79aH3iIgJKIFGrc8LD26L3OWv0JEokd6ZwMGFcKLHY00ISZcar4wk8kaANgv0JrgC2wAPWESbMWhPa0yBCbCC1EDHO4EpJuu09N5XliZgxRtk9bdXWA+rcWjWIQEfAejINWLJ53W1fLtblYdnue2nL5wglnLZ6xWstUcbvgU2UXNdEsamtCgCfiqlf/VLLkQ2/E2/9Gv9rJbYUNYc0o9ldM/UYxoe/7J7ApovGYZNgRdtR/NrAwFO1K2w5KpabQdK6L/6Jmlal2ROt0yNNBei+UCS1RPFbS3T0ZjJDCiDjzYPUWpFBj0L1VCA7e+iAAU2l2Do8aojAHoQRwW0jKyvK7wDcU8ovydwLZJ7yaAH3sEMiXLE80UJ8VdOvtfsVsJETjyT+EirL0Wu3BS9R9MJmHmDHUzMOeUTYJLwFE+beVHUdBI5JuLqG6AQqGYbNSvufF2AvG37H1tnig+bT0KLuUUj3t+D/1W5x52CwxhZulqgc2LJXIydoD2rpZ9IiESZjsqQEo0DQSGm4JjAWGEGt51xLWNICGM4lQVeKKlzG4SGBjS8CBjmWHnXBzfI1uqBQZNpkTTqH1xFp2FsHNz+bRV4alAxcqzZdz++H8TaH3jprn3yBrpgpFzXyRc0HwDikY/Fk4CF9Q4zXteXkC1vfSx16+76VoZNLpPvf0hwgNbsKHkvN//ikmfRtsdWnrJJMC31XwEn1nKS0o0jUp1JBVApA2EGLD7kVmw3iPTjiMLjNksdibItZCpwRDBBl4uv1AchZgM0jy+rN6nVNOojdMxjzn0twcMKRn/ElziSWd5KBhe3WqWXFTVUbdWqq+BToJa+v5giWKU9OkHDzt/6WjYjHq+6r+d7bY4Cqwhf5Nhwze7rAp8ObnflAXRQbc68VPy4t3+xCcEgaW3uXHTv8BB2mNFRAvoJq55z7yXqRJmUtipoaMQU+GSl1ZCQb9w/g4RgWCV4pKVITCRTiHHQYQmGMvQnjI0py7+9ojQRCj6G33rNZDhZS0hweFLldPVdSFgxUiHlhGq3X0leNARetBbICz7ScswA7N6EbPge2R50hJBlwV8jhniHjanikVcMBCL1h54Z1BxoL1OirPOll3qweyuuHybFzTY+yQes1AgHAlHOfj+mdjd5Pubv5ZyJho4+1/5ddgt4ebz+voOLsJynU9e37RNJJkzhiUD6nORmBDq5thyytjROg4qAh2HISwiRqxFpsBYbH30xunQO/XqFY6epgakxzWN2o2KGZ8oMyy7dBxXz9rr1mFpcBxaclEeuclFvM3HtZNTPmUqhJGMUCydSrHYEHCPlfpPb3uE/rcPg9W8+0W4AqSU0vOVKHqDa/C141kIA23R9OLA9/9bYbc6ixzBzgbZ/iwWGdHn6dA03MQlALRRqiiWCRkFdgFLAL0Eg/XrWxkNanDAkan3sB3uvslKp8AoE0syI7jROT1nwvHnr5j1WTSqbeG446Zh84OY7biW7KumbY/9lLvBJICFZ/8a8QsIRh/PmXOBO6vlm1cRP2s6vOaGkTLaAA5KZL+RvoDPVzTmt/ez8IYiNl3t8iuhEWHPfddW/YEUu47VdrLnadM0nd7t8DGIbBcRX4ETbJBEoccNUrAVmjTMggYS2dUk4/cQeoiMQGZiWBwShBW+ygSBAV1pE5oIU/RuwVENMxX1ZCVsAyf8R5jB0C5qwdZNNn8gmFhaz00mWd08C5LApPK6FF3kpG15Uql0nfz3iEJj5pXQCcbn8Dtdlpe4E9qYy/LLrsJgtx1YGD3vpKv3ccCUeGXNP/0OpKq2erc9di/d2ZdNd/aJ5D8fR4az6OzBFTPWRRO0eJbixs0PIIW22bvt1/9upF+y68qeSSL0we+AZcorUBlbHVlGcRZl7UETIO6l5LJIFBg4YUROZmJZ+lqALymtknZNo+1dcdW8LfR/a/7QOVyOq65WNY/kokFdzXujkfSUckwncltuZV6/qUsUn1Cys+ZatL79C3D811e7/FLWQT6d1MgBFzlgJqfl7rHA/RpzwfK3lLJ8WH4SEkKK8Bi5vtI0qIQ+HIMiE5YnLUEIMYgkNJXY3UOkBjZlMJq0DNI2cbOF3uKlClLPKuklIBl8Ri1PKqGVl21XvMXOQvZ5e8D59s+HTVRSt/KafIoVsZx1MvmXGJfFYimd+Bq28DV0cQAz31VN2QTCmiVTYFP5ulq+MZx6kYrOZpqmEe0jDGIl7YLCAOnvk0W5tAcTErm6IpomJ1MFRuGx6Cilsh5FfBGYdFTMXB/1ftI18swmKTHprwSElMkvKWUA13z0eHEPu/khahROwf0lE156jEVAwB/2J9av+QnSRiFkrb7v/7KeVS+dz9M/K7vpPR2TxW5DJAqN6CcM6XQakXAKIpjIF4mN9R/9/TbTBSZjNY3KR9ewW2bT30PpM750wh+v1DO7ahafD6fh9va61V499URhnSVj4N8Z3m/qB7gWTik2Hu245WFE2Ksbtz50m2jbPV0vIzWNhgkIJCKy+6kAY7DVhcD1VIHtInKBEUIXIumePdWv49rJaKFp2fMSbJrV9BHJlIMXVuSUouhgYMsvIqSwY74QbTQd9TLSEO6OEcXjXlhOv/fPP/U2rpP86sH86kXjT+lq/R5J2CkrtpzSgr5TFnjRQHaSuwe1BHTUf4aJ4KpeOLYnBVsKDzJa08T1EAfsReIwLnveSSLbXi4Gk8Bgt+bhAj4eSGQ5E2xKXrVeo2nULlfM2hhd/7OLz2Fyoq1meThNdOlUKx0Pl247lFS9oiSRuYfewHTgBSL3CgO+esG5yKuxUfxMZJfI7HcqAXqTplH5oDfOBEFBekOqZjW8tiLnrh29UWAwCL1O0zgKRiCDH4NUWj7tY2VXRUsEc2J5tz3+LgHhyOsXjZvn/pxZIQkAHb+ZTI+h5oIl4//raQU0yblweh2iAnJoyZQJ9IXYWhvdkBHNrTFCSzrqikRg00FntE1/0w44z/aS8Oi9TPksqofd2EgaYIvBpepswiPiQER+zB4SGJGMxbTyXdt4b1yeVPr1aknk58Jo1Sts3Q0W+Ib78PQmndt6u8AoSjVjxFeAkLzB18JLXFY68ZUXlM5YE99nTWe4oy3ULb/8avpPk+/g4g/1NJtddM4ggi/sO3XhJrUevdSDicK74yksjb7Gjff8mAncCwB6s6YBe2HTYCuut8DxJ3K6EcYTcmT0FiyLGZMYrpf4ePherWnUzhSf9xxmcmn+aT9XLvdhFbotSgGp+eCCQeT440oTpSRzZ8WMDUqSOW/aZsfhT5UTE+RgxLJ4wpTermnUgcDpR+TV6i0l5PhjDigJDFI1RAxfbMdFbz7X25cegz8hNI3KLToigiUAy44lu5R5RDqrrXqpUrV25dV9Qp3ebnOTi859+h0CwanL5oLhd+GkY9LS1aqcnFVKzaIJikB2+fbLPKPFIiHlz08UTaMyCltZEQ9rMj7AjoFrgu8ukGOHzKdHYBzuob3CBZKRQmN3DXHRp5DvrarHjBLe+4StsF6jM5lRrN5+JZK4znmzg8VCAnMq0T2YvpnhiJSrEkYDGbc82fJO8vS/dJOizus/uf0m+oJdsK/1u7dX8DDL4TkDl1cjVVS55cFqZ5sUjdt+s4BAsV9f4d18/+OolzfkOhydHVA26Q0Y2RwlHNaqW3kttvPYLR2hF4RsYVXsUzFtNsEESib853wVtnbFVWPp702d9Rv1hkxYzUl5nlGahgQGicBagxNLAhwhg3h76/d+gZct6L1ZAWEJbN212gSRcRH+YIe1i0dgIn2CZoxf+iDAIsshL5sMwWWMpqH3XNr6Tl2MIE0wp6xKGaxQIHaM+uD8UZh9O/1Hd3MtPXmDfjiT4F1lF7z55zCHEndVe0Xa0d1/AHwHnem+QamV7Fy5hvWNm//1Zfqv17vt0bt5R4SS5T2VMz8LvzTDjRtmw4XcAMr3wflnuekuGhEbjZcEITiRmSTUEKtS0N8MVQz7IRFN0Dh6Zh+uMtFeHcIiQX0OOwQxIr0FGXhe3kokMNCqSa+Dy0SBQf/Srmk8ox9BxBnZeKHCUQ/+UyKm0x2+yiO6W7iMtsfcXmAKMeAFWw7XyTeM5h1QPXC+AwuxFFpql81i+nu0eMsu/AsO+HXlnTQ74V01vgOLkAaaV7tsJuJmGVMyYYs3nLiB3YuI84yHkVjyRDQOD27AYLn08AJr4JDmicuUkpUCelhGS6Sd0ivC+RUZUDJhecLuCCckY4t6csbYLU6Pnje/4uSllDtmEpCFpYxb82lwQNhYmh7LF5Y96RmHRmSPRbQR3Enr5g684jwCyO87+T1dkWZ6g9tsqoeBWtF+aAX3WeeKWZ9r0kSRDiNeAm2xwxEHF5xbSJjaAr4D3IJJL1Ut6z97l3J1HF27n4SQMMkNn/8SF0yjz283ffEEfFFpLenUNPC0slPujmePaixnwtIK6nQJTKQ7rGUpvtdwCaDORWmVlkjjadE09ryBheXTVyu+FHsen6O1aceTWwn8YMPG+2grjdxKfUnijvxTcb4aecL9+l38kfLyCnuecpEnd1G35oeWTkMMCnfIdLbXrtzJjUADWHDGfdiiVxSd88Ql7Pqx1Ynavpjgt7ZVf5jSF4Elo6nHZysJjAfjxWbUcRB4mWpky61PYICJ/DvKmkLCw72kJaER2g4ZgLHopP4OwS77Rn81RfBxQ1bahKbHNU359LUYtAM5ZROYKsbfFLvXh2wHMDkn1NWCxGxDpfCsR9+GlvCMfOA6PYjobTLI2HPVr7sZcSIppfzij5TTEnR7Opdxr95jU7144gCyo4wIrTD9IjNeuLFIRQiqbluGhAURbFkJ2djiizjwQDtiW/iWuaPRa+OAlWmLS6XDEMZNVdhip7OI+jwgLF7JhEPziiyZbltu/7706fEx7JHlqfi8539PjMEOIJR/2s+QDJ60BNvxLlGyeheOhfGKrWyQXvJueFkCTquz0F0x81MFF+9bfFVig/5wGIjeLAeH5B5/8x5R4Yv239anElv2QPmMtVEHpMOF94YlL23Vy1SAejo9qltzs/Ane95TUoq4ESSB25cRIdpKwuKVITAkLHRYoRADJJJQHs9DaMpKh3sYlipDJdB2EAFLkWM1EFjsQPXy1BC9qJxSTZNbOQN72oqyKe9HrwPjiRrTSyzmUL12eqnF/xjuYQRB6flvYPeFdIejrsHXDTKCt7NhS7R69eIqF11SzRV5T9Zmbv+Z2Eqj2MoufG+RMjhJjuRocTVsuv8p8Ktp+28eMNIv3rqpNoRx3IMze+0YkjGDRAzVZP320EO45aFtZBZZ2hoeYtAoYuzjuHG+zE4lwyWrw4nawDZS7xtHgAuqN5xUIq/AIIFmla1d+0ROKxiilKLlcF5imRLZJCBuZ1jb8XZANgOj7dpdgwvoPmAvfrA6+ALYLXvfwP0zRw6vvl7vJYcJ++saeiNONYZKq/70Ki9T9MA17Xx2DcG7Gz67a7SeeslgPaMfmkfP7YWjfsV1IjPqqf5wKjzV+9rr1oo4DbnJT4mmIYGBdhG54QleTtlLJiYG+z5ZbpYdBwjc5DOxyOQlaBYxjrH0Mp2m4l0N15SuacjQtZTP2qj4HbKLRjHp62zcFoWpXjSRPL7N0nYDjvzTKipmfoKcYdpqe5i0AKCrNXzmjjcmpiKtW339PfS3r3XvG8q5chml7xQlwSuU238GV4KXGn0/8P4Z/YIdR5QoeiqKzNmBfFoHJQupnlIRH4aIk6tbvpDAwMeTSg0T3y4GlisUoGMgEWcSmdh2SidNfBuCDgK6AxUhqNsmi859ZiE9gBHnLRh+J9OBF+gIHxigc87YlkPAnF1HvxI5WtstPXred915JHr1b1bNhxdhWQ2VjPsD4kxFdDMFdibMol4MeWjpJed1er9AiqnhQo4/uAiCFdPXRJO87O5BTLz06h9oGYzF1/T6nzHMCjoBZGoaOLqAj8/qjRHaTMJSK1NgdPJABVdjOdCUsCfQD5GraLOcnjPYLl0OIsnxBxsPKRh6C5ypsA2l0BHfuEyhQQdhj7AvbDmWCpFlLCETrY4CN31EAoBYCr4Pdnpb6YNlElt+kTe6QDsUkODIOikp6sGGppE5vlGeG16eXEOuqyJsdLHQ6+/FsLLR1n/601sJPtC8+wUkI0kpxWOf+Q9ChDhMS/7pd97MQtrlq1FADi25UF0ij1LejbJroXc1IanbWj5tVfTgncPNPhTQXrs22mzNB5NIEDUv3WQRlOB5dukE3GYApmbTUrVcAUtyx58WzZENd9wHfhzd9Zw0A13G9haDJHJzJmazbIcUlhTgxIDrKVYSlmN2GwHfwSYSHBG3gbZdWekT2GJi+ffo6VQEFl5w9tlkHYjZKoGBbMBVBxTG2PP4YnfkwIOBGSQHHs5KSynuoT9RTlMWT3gpcpoSE5Etx3WrrkWMq6312z9H68UT5CgchSw5LHceuspkFZ7znA8HHDn+oBXg+MPpUCklf8TdD4HdxWOevD+GMPEwqlefHPjr8AJyZ8jJFJDSE31IEFOSoeG0rULbJT2tmIBEpCPsS0a+v3Er0gfhqVZeQqazwB4hm41zLeFDDk2qOz4lS2BAouHB47moMNgZE/CWvW8+Fmak8dKn/6UTCYvHc9ajfwI2Hu0CuKadzyAZ5TBpmJgdloQcEhzYOd80bpo7l74LyHb65xh44lnuPvVW5WYlukbtRvpydDZshf1Gb3L+Utgf1V6z/HXCUeRv+e5hlQaHa1BC6m3ZYb+gLafMHmivk8J3w0IjMPTQNN3mttI1IbD2c+igAdYWoi2kWv9B+g2Mpoi58g3HFRxperf3Krlon8vLGtc/7A5FDsZBsmBnQSPayfGIPqjSpg2iYqlHSCLSV2U32uo/uktrG8H20u24kyUw4Ec6hAaCUOooHBkOF4SCYIjKQDwDTRAa/I1n+ICJ8KNgG6nOUsDgmUhKACLeIus7Esk8cYLE818sU99G6MXSogqK9lvhhgYZ+KBMIkf+6fhZnUBCW3DSNFYSHGENp+2kYUN44PXtSketNtkedJ6x4Idpr0UwWnGUNdNWGKkEwqX0/Ldg40BoXa7BV3N5jIUbM1hRTVHd/+4gG8WjpAhNSpw/BvuZquqwSxCLGiShAcx2eFtFEswkNC+EQtpYp2N5EuqxaKVAR9gLf3jtDRAWLHHsvTijscOrrqm02POcoa7WTqfndEXTOgvPFCUxxfVU5aL/gGEiwk54odF03NrVvFfaqUQITIpHWzZ6w6aIStAJLzSH1865jDobJIERCj6yRq5+3S0XEEyo39SFYccfxxtyWTgz/fkJLzQ0AHCGiQQwecdOaAvMizwT4aQZR5nYuQhNsGOk5Ld018eO+vW76ffeMPlkxcF6RWeF5PHozmdxdqitbf/8lUIIdFQiwdl8ZMNdd1IVW+mkV3EGKeNKsKNB2tnvE1nT4DoQXADZUwWOqm7fr9BTBCRrx5pdpDfynxCdYbVav+6mawh7H4r7IGAIIQzSS2lVVRix2I/TjPS7AqN6RFFP405XnoWUfzGPcOTvEGYM9pHqM/yJv/E2XOCBp9lHlz+/Y7G7RMMMuse5Ze9rv0WloL9xL33BS51rsecrOTmRjzZcEI8/PqSgMkztp+oRV73j8XzRwqmw+A6GSMWAFvpCcFZKMSw0kUECk0AktqHaDqqdUwNl8UKiDRmogoOOaQVD6bzmA4ea+n+VCWhHub8m8oPSHl1PIjtfh4fpcCJCWFQaQYsaFkH/VSGK/1afadtQhQH8AB6VL/E8VoVOm4iO38AP1IHgmMXkgMkBkwMmB0wOmBwwOWBywOSAyQGTAyYHTA6YHDA5YHLA5IDJAZMDJgdMDpgcMDlgcsDkgMkBkwMmB0wOmBwwOWBywOSAyQGTAyYHTA6YHDA5YHLA5IDJAZMD3XLg/wA4QOLUuFKRAAAAAABJRU5ErkJggg==", 'base64'
  )

function GET() {
  return new server.NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': "public, max-age=0, must-revalidate",
    },
  })
}

const dynamic = 'force-static'

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Ffavicon.ico%2Froute&name=app%2Ffavicon.ico%2Froute&pagePath=private-next-app-dir%2Ffavicon.ico&appDir=%2Fhome%2Fafaq%2FDownloads%2FvirtualX-Final%2Fhooks%2Fapp&appPaths=%2Ffavicon.ico&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = app_route_module.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = "export"
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: route_kind.RouteKind.APP_ROUTE,
        page: "/favicon.ico/route",
        pathname: "/favicon.ico",
        filename: "favicon",
        bundlePath: "app/favicon.ico/route"
    },
    resolvedPagePath: "next-metadata-route-loader?page=%2Ffavicon.ico%2Froute&isDynamic=0!/home/afaq/Downloads/virtualX-Final/hooks/app/favicon.ico?__next_metadata_route__",
    nextConfigOutput,
    userland: favicon_next_metadata_route_namespaceObject
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/favicon.ico/route";


//# sourceMappingURL=app-route.js.map

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [3587,4218], () => (__webpack_exec__(50612)));
module.exports = __webpack_exports__;

})();