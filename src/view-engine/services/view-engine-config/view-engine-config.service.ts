import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as hbs from 'hbs';
import { join } from 'path';
import * as layouts from 'handlebars-layout';
import * as helpers from 'handlebars-helpers';

@Injectable()
export class ViewEngineConfigService implements OnApplicationBootstrap {
  onApplicationBootstrap(): any {
    hbs.registerPartials(join(process.cwd(), 'views', 'partials'));
    hbs.registerPartials(join(process.cwd(), 'views', 'layouts'));
    hbs.registerHelper('isNull', function (value: any | null, options) {
      return value === null ? options.fn(this) : options.inverse(this);
    });
    layouts.register(hbs.handlebars);
    helpers(['array', 'comparison'], { handlebars: hbs.handlebars });
  }
}
