import { USE_PIPE_METADATA, UsePipe, UsePipeMetadata } from './use-pipe';
import { Pipe, PipeContext } from '../types/pipe';

class FooPipe implements Pipe {
  transform(context: PipeContext): any {
  }
}

class BarPipe implements Pipe {
  transform(context: PipeContext): any {
  }
}

describe('@UsePipe', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      updatePig(@UsePipe(FooPipe) body) {
      }
    }

    const meta: UsePipeMetadata = [
      { args: [], index: 0, metaType: Object, pipe: FooPipe },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(USE_PIPE_METADATA, meta, Popcorn, 'updatePig');
  });

  it('should add the appropriate metadata while using decorator with args', () => {
    class Popcorn {
      updatePig(@UsePipe(FooPipe, [1245, 'foo']) body) {
      }
    }

    const usePipeMetadata: UsePipeMetadata = [
      { args: [1245, 'foo'], index: 0, metaType: Object, pipe: FooPipe },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(USE_PIPE_METADATA, usePipeMetadata, Popcorn, 'updatePig');
  });

  it('should add the appropriate metadata when the decorator is used multiple times', () => {
    class Body {
      name: string;
    }

    class Popcorn {
      updatePig(
        @UsePipe(BarPipe, ['bar']) @UsePipe(FooPipe) body: Body,
        @UsePipe(BarPipe) @UsePipe(FooPipe, ['foo']) params,
      ) {
      }
    }

    const usePipeMetadata: UsePipeMetadata = [
      { args: ['foo'], index: 1, metaType: Object, pipe: FooPipe },
      { args: [], index: 1, metaType: Object, pipe: BarPipe },
      { args: [], index: 0, metaType: Body, pipe: FooPipe },
      { args: ['bar'], index: 0, metaType: Body, pipe: BarPipe },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(4);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(USE_PIPE_METADATA, usePipeMetadata, Popcorn, 'updatePig');
  });
});
