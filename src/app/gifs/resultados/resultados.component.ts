import { Component, OnInit } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styles: []
})
export class ResultadosComponent implements OnInit {

  constructor(private gifsService: GifsService) { }

  get resultados() {
    return this.gifsService.resultados;
  }
  get notFound() {
    return this.gifsService.notFound;
  }
  get pagina() {
    return this.gifsService.pagina;
  }
  get totalPaginas() {
    return this.gifsService.totalPaginas;
  }

  ngOnInit(): void {
  }

  cambiarPagina(N: number) {
    this.gifsService.nextPage(N);
  }

}
