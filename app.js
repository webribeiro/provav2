angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/livros', {
                templateUrl: 'views/livros.html',
                controller: 'livroController'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginController'
            })
            .otherwise({ redirectTo: '/login'});

})
.controller('pageController', function ($scope, usuariosService) {

    $scope.logout = function(){
        usuariosService.logout();
    }

})
.controller('livroController', function ($scope, livrosService) {
    $scope.livros = livrosService.getLivros();
    
})
.controller('loginController', function ($scope, usuariosService) {

    $scope.logar = function(user){
        usuariosService.validaLogin(user);
    }
})

.controller('usuariosController', function ($scope, usuariosService) {
    $scope.usuarios = usuariosService.getUsers();
    
})

.service('usuariosService', function ($rootScope, $location) {

    /*Nesta função, vamos fazer o papel de validação que seria feito no backend */
    this.validaLogin = function(user){
        //Vamos criar usuários fictícios que possam ser usados pela página e pra validar o login
        var usuarios = [{username:'admin', password:'123', admin:true},
            {username:'guilherme', password:'123', admin:false}
        ]

        //Aqui, faremos um for para validar o login
        angular.forEach(usuarios, function(value, index){
            if(value.username == user.username &&
                value.password == user.password){
                delete value.password;
                $rootScope.usuarioLogado = value;
                $location.path('/livros')
            }
        })
    }

    this.logout = function(){
        $rootScope.usuarioLogado = null;
        $location.path('/login')
    }

})
.service('livrosService', function () {
    
    this.getLivros = function(){
        return [{nome:'Como Eu Era Antes de Você'},
            {nome:'A sereia'},
            {nome:'Quatro Vidas de Um Cachorro'},
            {nome:'Diário de Um Banana: Vai Ou Racha'},
            {nome:'Por Que Fazemos o Que Fazemos?'},
            {nome:'A Garota no Trem'},
            {nome:'O Orfanato da Srta. Peregrine Para Crianças Peculiares'},
            {nome:'Como Eu Era Antes de Você'},
            {nome:'Rita Lee – Uma Autobiografia'},
            {nome:'Harry Potter e a Criança Amaldiçoada'},
            {nome:'O Nome da Rosa'},
            {nome:'Diário de Anne Frank'},
            {nome:'Dom Casmurro'},
            {nome:'O Senhor dos Anéis'},
            {nome:'Grande Sertão Veredas'},
            {nome:'Cem Anos de Solidão'},
            {nome:'Ansiedade 2 – Autocontrole'},
            {nome:'Não se enrola, não'},
            {nome:'Belo Sacrifício - Irmãos Maddox'}
        ];
    }
})
.run(function ($rootScope, $location) {
    //Rotas que necessitam do login
    var rotasBloqueadasUsuariosNaoLogados = ['/livros'];
    var rotasBloqueadasUsuariosComuns = ['/livros'];

    $rootScope.$on('$locationChangeStart', function () { 
        if($rootScope.usuarioLogado == null && rotasBloqueadasUsuariosNaoLogados.indexOf($location.path()) != -1){
            $location.path('/login');
        }else
        if($rootScope.usuarioLogado != null &&
            rotasBloqueadasUsuariosComuns.indexOf($location.path()) != -1 &&
            $rootScope.usuarioLogado.admin == false){
            $location.path('/login')
        }
    });
});