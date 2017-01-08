/**
 * Created by EdgeTech on 8/15/2016.
 */

import {UrlResolver} from "@angular/compiler";
import * as path from "path";

export class NodeUrlResolver extends UrlResolver {
  resolve(baseUrl: string, url: string): string {
    return `file://${path.resolve(path.join(path.dirname(baseUrl),url))}`;
  }
}
