import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, GiphyResponse } from '../models/giphy.model';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  // tslint:disable-next-line:variable-name
  private _historial: string[];
  private apiKey = 'LdgTIC2AF23oEabM94ilWrH4rrOqX1MQ';
  private URL = 'https://api.giphy.com/v1/gifs/search';
  public pagina: number;
  public totalPaginas: number;
  private limit: number;
  public resultados: Gif[];
  public notFound: string;
  public lastQuery: string;

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this.pagina = 0;
    this.totalPaginas = JSON.parse(localStorage.getItem('totalPaginas')) || 1;
    this.lastQuery = JSON.parse(localStorage.getItem('lastQuery')) || '';
    this.limit = 12;
    this.notFound = '';
    this._historial = JSON.parse(localStorage.getItem('historial')) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')) || [];
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!query) {
      return;
    }
    this.pagina = 0;
    this.notFound = '';
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', this.limit.toString())
      .set('q', query);
    this.http.get<GiphyResponse>(this.URL, {params}).subscribe(res => {
      if (res.data.length === 0) {
        this.notFound = query;
        this.resultados = [];
        return;
      }
      this.lastQuery = query;
      localStorage.setItem('lastQuery', JSON.stringify(query));
      this.totalPaginas = Math.ceil(res.pagination.total_count / this.limit);
      localStorage.setItem('totalPaginas', JSON.stringify(this.totalPaginas));
      this.resultados = res.data;
      localStorage.setItem('resultados', JSON.stringify(res.data));
      if (!this._historial.includes(query)) {
        this._historial.unshift(query);
        this._historial = this._historial.slice(0, 10);
        localStorage.setItem('historial', JSON.stringify(this._historial));
      }
    });
  }

  nextPage(N: number) {
    if (this.pagina + N < 0 || this.pagina + N >= this.totalPaginas) {
      return;
    }
    this.pagina += N;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', this.limit.toString())
      .set('offset', (this.pagina * this.limit).toString())
      .set('q', this.lastQuery);
    this.http.get<GiphyResponse>(this.URL, {params}).subscribe(res => {
      console.log(res);
      this.resultados = res.data;
    });
  }

}

/*******************
 * API key:
 * LdgTIC2AF23oEabM94ilWrH4rrOqX1MQ
 */
